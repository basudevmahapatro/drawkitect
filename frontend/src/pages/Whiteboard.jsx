import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Toolbar from '../components/Toolbar';
import Toolbox from '../components/Toolbox';
import BoardProvider from '../store/BoardProvider';
import ToolboxProvider from '../store/ToolboxProvider';
import WhiteboardControls from '../components/WhiteboardControls';
import { api } from '../store/AuthProvider';
import { createRoughElement, getSvgPathFromStroke } from '../utils/element';
import getStroke from 'perfect-freehand';

function Whiteboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialElements, setInitialElements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const response = await api.get(`/canvas/${id}`);
        const rawElements = response.data.elements || [];
        
        const rebuiltElements = rawElements.map((ele) => {
          if (ele.type === "BRUSH") {
            return {
              ...ele,
              path: new Path2D(getSvgPathFromStroke(getStroke(ele.points)))
            };
          } else if (["LINE", "RECTANGLE", "CIRCLE", "ARROW"].includes(ele.type)) {
            return createRoughElement(ele.id, ele.x1, ele.y1, ele.x2, ele.y2, {
              type: ele.type,
              stroke: ele.stroke,
              fill: ele.fill,
              size: ele.size
            });
          }
          return ele; // for TEXT and others
        });

        setInitialElements(rebuiltElements);
      } catch (error) {
        console.error("Failed to load canvas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCanvas();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading canvas...</div>;
  }

  if (initialElements === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p>Canvas not found or access denied.</p>
          <button onClick={() => navigate('/workspace')} className="text-blue-500 underline">Return to Workspace</button>
      </div>
    );
  }

  return (
    <>
      <BoardProvider initialElements={initialElements}>
        <ToolboxProvider>
          <WhiteboardControls />
          <Toolbar />
          <Board />
          <Toolbox />
        </ToolboxProvider>
      </BoardProvider>
    </>
  );
}

export default Whiteboard;
