import { useEffect, useRef, useState } from 'react';
import { JewelryStage, hasWebGL } from '../three/JewelryStage.js';

export default function Viewer3D({ spec, fallback }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!hasWebGL()) { setFailed(true); return; }
    let stage = null;
    try { stage = new JewelryStage(host.current, { mode: 'orbit' }); stage.setSpec(spec); }
    catch (e) { console.warn(e); setFailed(true); }
    return () => { stage && stage.dispose(); };
  }, [spec]);
  if (failed) return <img className="viewer-fallback" src={fallback} alt="" />;
  return <div ref={host} className="viewer" />;
}
