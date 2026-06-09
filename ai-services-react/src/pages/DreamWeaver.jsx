import { useEffect, useMemo, useRef, useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import ServicePanel from "../components/ServicePanel.jsx";
import { normalizeAssetUrl } from "../utils/format.js";

export default function DreamWeaver({ client, token }) {
  const [textPrompt, setTextPrompt] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef(null);

  useEffect(() => () => clearInterval(pollingRef.current), []);

  const absoluteImageUrl = useMemo(() => normalizeAssetUrl(client.baseUrl, imageUrl), [client.baseUrl, imageUrl]);

  const pollImage = (id) => {
    clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const status = await client.get(`/api/imagegeneration/status/${encodeURIComponent(id)}`);
        setProgress(Number(status.progress || 0));
        setImageUrl((currentUrl) => status.image_url || currentUrl);

        if (status.status === "finished") {
          const result = await client.get(`/api/imagegeneration/result/${encodeURIComponent(id)}`);
          setResourceId(result.resource_id || "");
          setImageUrl(result.image_url || status.image_url || "");
          setProgress(100);
          setIsWorking(false);
          clearInterval(pollingRef.current);
        }
      } catch (requestError) {
        clearInterval(pollingRef.current);
        setIsWorking(false);
        setError(requestError.message);
      }
    }, 2000);
  };

  const generateImage = async () => {
    if (!textPrompt.trim()) {
      setError("Введите текст для генерации изображения.");
      return;
    }

    setError("");
    setIsWorking(true);
    setProgress(0);
    setImageUrl("");
    setResourceId("");

    try {
      const data = await client.post("/api/imagegeneration/generate", {
        text_prompt: textPrompt.trim(),
      });
      pollImage(data.job_id);
    } catch (requestError) {
      setIsWorking(false);
      setError(requestError.message);
    }
  };

  const runResourceAction = async (path) => {
    if (!resourceId) {
      setError("Сначала дождитесь готового изображения.");
      return;
    }

    setError("");
    setIsWorking(true);
    setProgress(0);

    try {
      const data = await client.post(path, { resource_id: resourceId });
      pollImage(data.job_id);
    } catch (requestError) {
      setIsWorking(false);
      setError(requestError.message);
    }
  };

  return (
    <ServicePanel
      title="DreamWeaver"
      subtitle="Генерируйте изображения, улучшайте качество и меняйте масштаб."
      token={token}
      error={error}
    >
      <div className="image-grid">
        <div className="control-stack">
          <label>
            Текстовый запрос
            <textarea
              value={textPrompt}
              onChange={(event) => setTextPrompt(event.target.value)}
              disabled={isWorking}
              placeholder="Например, футуристический город ночью"
            />
          </label>
          <div className="button-row">
            <button type="button" onClick={() => setTextPrompt("")} disabled={isWorking}>
              Очистить
            </button>
            <button className="primary" type="button" onClick={generateImage} disabled={!token || isWorking}>
              {isWorking ? "Генерация..." : "Создать"}
            </button>
          </div>
          <div className="button-row">
            <button type="button" onClick={() => runResourceAction("/api/imagegeneration/upscale")} disabled={isWorking || !resourceId}>
              Улучшить
            </button>
            <button type="button" onClick={() => runResourceAction("/api/imagegeneration/zoom/in")} disabled={isWorking || !resourceId}>
              Приблизить
            </button>
            <button type="button" onClick={() => runResourceAction("/api/imagegeneration/zoom/out")} disabled={isWorking || !resourceId}>
              Отдалить
            </button>
          </div>
          {isWorking && <ProgressBar value={progress} />}
        </div>

        <div className="image-stage">
          {absoluteImageUrl ? (
            <>
              <img className={isWorking ? "preview-image loading" : "preview-image"} src={absoluteImageUrl} alt="Generated result" />
              <a className="download-link" href={absoluteImageUrl} download>
                Сохранить изображение
              </a>
            </>
          ) : (
            <span>Изображение появится здесь</span>
          )}
        </div>
      </div>
    </ServicePanel>
  );
}
