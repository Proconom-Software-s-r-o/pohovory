using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.IO;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Commons.Storage
{
    public class StorageOptions
    {
        public const string SectionName = "Storage";

        /// <summary>Slozka s JSON soubory, relativne ke korenu projektu.</summary>
        public string DataFolder { get; set; } = "Data";
    }

    public class JsonFileStore : IJsonFileStore
    {
        /// <summary>Jeden zamek na soubor - zabranuje soubeznemu zapisu ze dvou requestu.</summary>
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new(StringComparer.OrdinalIgnoreCase);

        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            WriteIndented = true,
            PropertyNamingPolicy = null,
            // Aby v souboru zustala ctitelna diakritika a ne \u00ed
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            Converters = { new JsonStringEnumConverter() },
        };

        private readonly string _dataFolder;

        public JsonFileStore(IOptions<StorageOptions> options, string contentRootPath)
        {
            _dataFolder = Path.Combine(contentRootPath, options.Value.DataFolder);
        }

        public async Task<List<T>> ReadAsync<T>(string fileName, CancellationToken cancellationToken)
        {
            string path = ResolvePath(fileName);
            if (!File.Exists(path))
            {
                return new List<T>();
            }

            SemaphoreSlim fileLock = GetLock(path);
            await fileLock.WaitAsync(cancellationToken);
            try
            {
                await using FileStream stream = File.OpenRead(path);
                List<T> items = await JsonSerializer.DeserializeAsync<List<T>>(stream, SerializerOptions, cancellationToken);
                return items ?? new List<T>();
            }
            catch (JsonException ex)
            {
                throw new BadDataException($"Soubor {fileName} neni platny JSON: {ex.Message}");
            }
            finally
            {
                fileLock.Release();
            }
        }

        public async Task WriteAsync<T>(string fileName, IReadOnlyCollection<T> items, CancellationToken cancellationToken)
        {
            string path = ResolvePath(fileName);
            Directory.CreateDirectory(_dataFolder);

            SemaphoreSlim fileLock = GetLock(path);
            await fileLock.WaitAsync(cancellationToken);
            try
            {
                string tempPath = path + ".tmp";
                await using (FileStream stream = File.Create(tempPath))
                {
                    await JsonSerializer.SerializeAsync(stream, items, SerializerOptions, cancellationToken);
                }

                File.Move(tempPath, path, overwrite: true);
            }
            finally
            {
                fileLock.Release();
            }
        }

        private string ResolvePath(string fileName) => Path.Combine(_dataFolder, fileName);

        private static SemaphoreSlim GetLock(string path) => Locks.GetOrAdd(path, _ => new SemaphoreSlim(1, 1));
    }
}
