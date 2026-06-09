import { formatProbability } from "../utils/format.js";

export default function ObjectOverlay({ imageUrl, objects }) {
  return (
    <div className="overlay-wrap">
      <img src={imageUrl} alt="Recognition target" />
      {objects.map((item, index) => {
        const box = item.bounding_box || {};
        return (
          <div
            className="object-box"
            key={`${item.name}-${index}`}
            style={{
              left: `${box.x || 0}%`,
              top: `${box.y || 0}%`,
              width: `${box.width || 0}%`,
              height: `${box.height || 0}%`,
            }}
          >
            <span>
              {item.name} {formatProbability(item.probability)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
