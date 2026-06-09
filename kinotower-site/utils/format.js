export function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("ru-RU");
}

export function posterFor(film) {
  const title = encodeURIComponent(film?.name || "Kinotower");
  return film?.link_img || `https://placehold.co/520x720/16213a/f8fafc?text=${title}`;
}
