import { ScehmaFromText } from '../types';
import api from '../API/Index';

const CUSTOM_LLM_API_KEY = 'dummy';

export const getNodeLabelsAndRelTypesFromText = async (
  model: string,
  inputText: string,
  isSchemaText: boolean,
  isLocalStorage?: boolean,
  customLLMModel?: string,
  customLLMBaseUrl?: string
) => {
  const formData = new FormData();
  formData.append('model', model);
  formData.append('input_text', inputText);
  formData.append('is_schema_description_checked', JSON.stringify(isSchemaText));
  formData.append('is_local_storage', String(isLocalStorage));
  if (customLLMModel && customLLMBaseUrl) {
    formData.append('custom_llm_model', customLLMModel);
    formData.append('custom_llm_base_url', customLLMBaseUrl);
    formData.append('custom_llm_api_key', CUSTOM_LLM_API_KEY);
    formData.append('api_key', CUSTOM_LLM_API_KEY);
  }

  try {
    const response = await api.post<ScehmaFromText>(`/populate_graph_schema`, formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
