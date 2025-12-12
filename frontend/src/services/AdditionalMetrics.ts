import api from '../API/Index';

const CUSTOM_LLM_API_KEY = 'dummy';

const getAdditionalMetrics = async (
  question: string,
  context: string[],
  answer: string[],
  reference: string,
  model: string,
  mode: string[],
  customLLMModel?: string,
  customLLMBaseUrl?: string
) => {
  try {
    const formData = new FormData();
    formData.append('question', question ?? '');
    formData.append('context', JSON.stringify(context) ?? '');
    formData.append('answer', JSON.stringify(answer) ?? '');
    formData.append('reference', reference ?? '');
    formData.append('model', model ?? '');
    formData.append('mode', JSON.stringify(mode) ?? '');
    if (customLLMModel && customLLMBaseUrl) {
      formData.append('custom_llm_model', customLLMModel);
      formData.append('custom_llm_base_url', customLLMBaseUrl);
      formData.append('custom_llm_api_key', CUSTOM_LLM_API_KEY);
      formData.append('api_key', CUSTOM_LLM_API_KEY);
    }

    const response = await api.post(`/additional_metrics`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log('Error in connecting to the Neo4j instance :', error);
    throw error;
  }
};
export default getAdditionalMetrics;
