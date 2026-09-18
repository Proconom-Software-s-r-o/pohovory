using System.Text.Json.Serialization;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Pohovor.Api.v1.DataManagers.StavbaManager;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Commons;
using Pohovor.Commons.Claims;
using Pohovor.Commons.Logger;
using Pohovor.Commons.Storage;

namespace Pohovor.Api
{
    public class Startup
    {
        private const string CorsPolicyName = "PohovorCors";

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // Enumy chodi na frontend jako cisla (stejne jako v ostre aplikaci)
                    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
                });

            services.AddHttpContextAccessor();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Pohovor API", Version = "v1" });
            });

            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicyName, policy => policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });

            services.AddAutoMapper(config =>
            {
                // Diky tomu se property XId namapuje na Id
                config.RecognizePrefixes("X");
            }, typeof(Startup).Assembly);

            services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(Startup).Assembly));

            services.Configure<StorageOptions>(Configuration.GetSection(StorageOptions.SectionName));

            // Uloziste ukazuje do slozky projektu, ne do bin/ - zmeny jsou tak rovnou videt v repozitari
            services.AddSingleton<IJsonFileStore>(sp => new JsonFileStore(
                sp.GetRequiredService<IOptions<StorageOptions>>(),
                sp.GetRequiredService<IWebHostEnvironment>().ContentRootPath));

            services.AddSingleton<IRequestLogger, RequestLogger>();
            services.AddScoped<IClaimResolver, ClaimResolver>();
            services.AddScoped<IZaznamManager, ZaznamManager>();
            services.AddScoped<IStavbaManager, StavbaManager>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "Pohovor API v1"));

            app.UseRouting();
            app.UseCors(CorsPolicyName);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("/swagger");
                    return System.Threading.Tasks.Task.CompletedTask;
                });
            });
        }
    }
}
