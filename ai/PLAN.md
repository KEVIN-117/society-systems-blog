# 🎟️ Ticket: AI Model for Article Classification

## 📌 Contexto
Actualmente el blog permite que múltiples autores publiquen artículos. Se requiere un sistema de moderación automática que clasifique el contenido en varias categorías para identificar artículos aceptables y artículos con contenido indebido.

## 🎯 Objetivo
Implementar un modelo de **clasificación multi‑label** basado en **Transformers (BERT)** que analice artículos y sus metadatos, y devuelva probabilidades para las siguientes etiquetas:

- Sexual  
- Violent  
- Spam  
- Hate/Discrimination  
- Acceptable  

## 📂 Dataset
Cada artículo contiene los siguientes campos:
- `title`: string  
- `description`: string  
- `cover`: image url (futuro, opcional)  
- `content`: string  
- `author`: string  
- `category`: string  
- `published`: boolean  
- `createdAt`: date  
- `updatedAt`: date  

## 🛠️ Tareas
1. **Entrenamiento del modelo**  
   - Usar `bert-base-multilingual-cased` (soporte español/inglés).  
   - Configurar `BertForSequenceClassification` con `problem_type="multi_label_classification"`.  
   - Función de pérdida: `BCEWithLogitsLoss`.  
   - Métricas: F1 por clase, macro/micro F1.  

2. **Preprocesamiento**  
   - Concatenar metadatos relevantes (`title`, `description`, `author`) con el `content`.  
   - Tokenización con el tokenizer de BERT.  
   - Longitud máxima: 512 tokens.  

3. **Inferencia**  
   - El modelo devuelve un vector de probabilidades por etiqueta.  
   - Aplicar umbral configurable (ej. 0.5).  
   - Si el artículo recibe etiquetas “malo” (sexual, violento, spam, odio) → enviar a revisión humana.  
   - Si solo recibe “aceptable” → publicar automáticamente.  

4. **Despliegue con TensorFlow.js**  
   - Exportar modelo entrenado a formato TensorFlow (`SavedModel`).  
   - Convertir a TensorFlow.js con `tensorflowjs_converter`.  
   - Integrar en frontend/backend del blog para clasificación en tiempo real.  

5. **Extensión futura (multimodal)**  
   - Incluir embeddings de imágenes (cover) con CLIP/ViT.  
   - Fusionar embeddings de texto + imagen para clasificación más robusta.  

## ✅ Criterios de aceptación
- El sistema clasifica artículos en las 5 etiquetas definidas.  
- Se puede configurar el umbral de decisión.  
- Los artículos marcados como “malo” no se publican automáticamente.  
- El modelo corre en producción con TensorFlow.js.  
- Documentación clara para reentrenar y actualizar el modelo.  
