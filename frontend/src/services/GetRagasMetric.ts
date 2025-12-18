import { MetricsResponse } from '../types';
import api from '../API/Index';

const CUSTOM_LLM_API_KEY = 'dummy';

export const getChatMetrics = async (
  question: string,
  context: string[],
  answer: string[],
  model: string,
  mode: string[],
  customLLMModel?: string,
  customLLMBaseUrl?: string
) => {
  const formData = new FormData();
  formData.append('question', question);
  formData.append('context', JSON.stringify(context));
  formData.append('answer', JSON.stringify(answer));
  formData.append('model', model);
  formData.append('mode', JSON.stringify(mode));
  if (customLLMModel && customLLMBaseUrl) {
    formData.append('custom_llm_model', customLLMModel);
    formData.append('custom_llm_base_url', customLLMBaseUrl);
    formData.append('custom_llm_api_key', CUSTOM_LLM_API_KEY);
    formData.append('api_key', CUSTOM_LLM_API_KEY);
  }
  try {
    const response = await api.post<MetricsResponse>(`/metric`, formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
