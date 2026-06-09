import { useEffect, useState } from "react";
import ObjectOverlay from "../components/ObjectOverlay.jsx";
import ServicePanel from "../components/ServicePanel.jsx";

export default function MindReader({ client, token }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [objects, setObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const recognize = async () => {
    if (!file) {
      setError("Выберите изображение для распознавания.");
      return;
    }

    setError("");
    setIsLoading(true);
    setObjects([]);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await client.form("/api/imagerecognition/recognize", formData);
      setObjects(data.objects || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ServicePanel
      title="MindReader"
      subtitle="Загрузите изображение и посмотрите найденные объекты поверх него."
      token={token}
      error={error}
    >
      <div className="recognition-grid">
        <div className="control-stack">
          <label>
            Изображение
            <input accept="image/*" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <button className="primary" type="button" onClick={recognize} disabled={!token || isLoading}>
            {isLoading ? "Распознавание..." : "Загрузить"}
          </button>
          {objects.length > 0 && <p className="result-count">Распознано объектов: {objects.length}</p>}
        </div>

        <div className="recognition-stage">
          {previewUrl ? (
            <ObjectOverlay imageUrl={previewUrl} objects={objects} />
          ) : (
            <span>Выбранное изображение появится здесь</span>
          )}
        </div>
      </div>
    </ServicePanel>
  );
}
