import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { memo } from 'react';
import { Separator as PanelResizeHandle } from 'react-resizable-panels';
import './panelResizer.css';

type PanelResizerProps = {
    orientation?: 'horizontal' | 'vertical';
};

const PanelResizer = ({ orientation = 'horizontal' }: PanelResizerProps) => (
    <PanelResizeHandle
        className="panel-resizer d-flex flex-column align-items-center justify-content-center"
        style={orientation === 'vertical' ? { height: '5px' } : { width: '5px' }}
    >
        <DragIndicatorIcon sx={{ fontSize: '0.85rem' }} />
    </PanelResizeHandle>
);

export default memo(PanelResizer);
