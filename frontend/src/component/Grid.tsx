import { useEffect, useState, useRef, useCallback} from 'react'
import { Circuit } from './Circuit';
import { getCircuitData } from '../service/CircuitService';
import type { FetchData } from '../model/FetchData';

function useSvgViewport({ minScale = 0.5, maxScale = 4, step = 0.1 } = {}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [state, setState] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0
  });

  // ZOOM HANDLER
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const cursor = pt.matrixTransform(ctm.inverse());

    setState(prev => {
      const direction = e.deltaY > 0 ? -1 : 1;
      let newScale = prev.scale + direction * step;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      const scaleFactor = newScale / prev.scale;

      const newX = cursor.x - (cursor.x - prev.translateX) * scaleFactor;
      const newY = cursor.y - (cursor.y - prev.translateY) * scaleFactor;

      return {
        ...prev,
        scale: newScale,
        translateX: newX,
        translateY: newY,
      };
    });
  }, []);

  // DRAG HANDLING
  const onMouseDown = useCallback((e: MouseEvent) => {
    if (e.button != 0) return;

    setState(prev => {
      return {
        ...prev,
        isDragging: true,
        lastX: e.clientX,
        lastY: e.clientY
      } 
    });
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setState(prev => {
      if (!prev.isDragging) return prev;

      const dx = (e.clientX - prev.lastX) / prev.scale;
      const dy = (e.clientY - prev.lastY) / prev.scale;

      return {
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy,
        lastX: e.clientX,
        lastY: e.clientY
      }
    });
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    setState(prev => {
      return {
        ...prev,
        isDragging: false
      }
    });
  }, []);

  // ATTACH LISTENERS
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.addEventListener("wheel", onWheel, { passive: false });
    svg.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      svg.removeEventListener("wheel", onWheel);
      svg.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
  }, [onWheel]);

  const transform = `translate(${state.translateX}, ${state.translateY}) scale(${state.scale})`;

  return { svgRef, transform };
}

export function Grid( { circuit_id = 0 } : { circuit_id?: number } ) {
  const [circuitData, setCircuitData] = useState<FetchData | null>(null);
  const { svgRef, transform } = useSvgViewport();

  // Loading data from database
  useEffect(() => {
    const loadCircuit = async () => {
      const newData = await getCircuitData(circuit_id);
      setCircuitData(newData);
    }

    loadCircuit()
  }, [circuit_id])
  
  const circuit = circuitData ? <Circuit fetchedData={circuitData} transform={transform}/> : null;
  return (
    <>
      <div id="grid-container">
        <svg id='grid' ref={svgRef}>
          {circuit}
        </svg>
      </div>
    </>
  );
}