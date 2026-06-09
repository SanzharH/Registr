export const DEFAULT_API_BASE =
  import.meta.env.VITE_API_BASE || "https://testuser1-task1-3847.infra.wsk17.dev";

export const routes = {
  home: "/",
  chat: "/chatterblast",
  imageGeneration: "/dreamweaver",
  imageRecognition: "/mindreader",
};

export const services = [
  {
    id: "chatterblast",
    name: "ChatterBlast",
    path: routes.chat,
    description: "Чат-бот с продолжением разговора и частичными ответами.",
  },
  {
    id: "dreamweaver",
    name: "DreamWeaver",
    path: routes.imageGeneration,
    description: "Генерация, улучшение и масштабирование изображений.",
  },
  {
    id: "mindreader",
    name: "MindReader",
    path: routes.imageRecognition,
    description: "Распознавание объектов на загруженном изображении.",
  },
].sort((a, b) => a.name.localeCompare(b.name));
