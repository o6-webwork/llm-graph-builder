import { TextInput } from '@neo4j-ndl/react';
import React, { useState } from 'react';
import { CustomFile, CustomFileBase, PostgreSQLModalProps } from '../../../types';
import { urlScanAPI } from '../../../services/URLScan';
import { useFileContext } from '../../../context/UsersFiles';
import { v4 as uuidv4 } from 'uuid';
import CustomModal from '../../../HOC/CustomModal';
import { buttonCaptions } from '../../../utils/Constants';

const PostgreSQLModal: React.FC<PostgreSQLModalProps> = ({ hideModal, open }) => {
  const [endpoint, setEndpoint] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<'unknown' | 'success' | 'info' | 'warning' | 'danger'>('unknown');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const { setFilesData, model, filesData, selectedModelOption, customLLMModel, customLLMBaseUrl } = useFileContext();

  const reset = () => {
    setEndpoint('');
    setUsername('');
    setPassword('');
  };

  const submitHandler = async () => {
    if (!endpoint.trim()) {
      setStatus('warning');
      setStatusMessage('Please provide the PostgreSQL endpoint.');
      setTimeout(() => setStatus('unknown'), 5000);
      return;
    }
    if (selectedModelOption === 'custom' && (!customLLMModel.trim() || !customLLMBaseUrl.trim())) {
      setStatus('danger');
      setStatusMessage('Please provide custom LLM URL and model name.');
      return;
    }
    const defaultValues: CustomFileBase = {
      processingTotalTime: 0,
      status: 'New',
      nodesCount: 0,
      relationshipsCount: 0,
      type: 'TEXT',
      model: model,
      fileSource: 'postgresql',
      processingProgress: undefined,
      retryOption: '',
      retryOptionStatus: false,
      chunkNodeCount: 0,
      chunkRelCount: 0,
      entityNodeCount: 0,
      entityEntityRelCount: 0,
      communityNodeCount: 0,
      communityRelCount: 0,
    };
    try {
      setStatus('info');
      setStatusMessage('Connecting...');
      const apiResponse = await urlScanAPI({
        urlParam: endpoint.trim(),
        model: model,
        source_type: 'postgresql',
        pg_username: username.trim() || undefined,
        pg_password: password.trim() || undefined,
        custom_llm_model: selectedModelOption === 'custom' ? customLLMModel : undefined,
        custom_llm_base_url: selectedModelOption === 'custom' ? customLLMBaseUrl : undefined,
        custom_llm_api_key: selectedModelOption === 'custom' ? 'dummy' : undefined,
        api_key: selectedModelOption === 'custom' ? 'dummy' : undefined,
      });
      if (apiResponse?.data.status === 'Failed' || !apiResponse.data) {
        setStatus('danger');
        setStatusMessage('Connection failed. Please check your credentials.');
        setTimeout(() => {
          hideModal();
          setStatus('unknown');
          reset();
        }, 5000);
        return;
      }
      setStatus('success');
      setStatusMessage(`Successfully created source nodes for ${apiResponse.data.success_count} items`);
      const copiedFilesData: CustomFile[] = [...filesData];
      apiResponse?.data?.file_name?.forEach((item: { fileName: string; fileSize: number; url: string }) => {
        const filedataIndex = copiedFilesData.findIndex((f) => f.name === item.fileName);
        if (filedataIndex === -1) {
          copiedFilesData.unshift({
            name: item.fileName,
            size: item.fileSize,
            sourceUrl: item.url,
            uploadProgress: 100,
            id: uuidv4(),
            ...defaultValues,
          });
        } else {
          const tempFileData = copiedFilesData[filedataIndex];
          copiedFilesData.splice(filedataIndex, 1);
          copiedFilesData.unshift({
            ...tempFileData,
            status: defaultValues.status,
            nodesCount: defaultValues.nodesCount,
            relationshipsCount: defaultValues.relationshipsCount,
            processingTotalTime: defaultValues.processingTotalTime,
            model: defaultValues.model,
            fileSource: defaultValues.fileSource,
            processingProgress: defaultValues.processingProgress,
            uploadProgress: 100,
          });
        }
      });
      setFilesData(copiedFilesData);
      reset();
    } catch (error) {
      setStatus('danger');
      setStatusMessage('An error occurred. Please check your connection.');
    }
    setTimeout(() => {
      setStatus('unknown');
      hideModal();
    }, 500);
  };

  const onClose = () => {
    hideModal();
    reset();
    setStatus('unknown');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      // @ts-ignore
      const { form } = e.target;
      const index = Array.prototype.indexOf.call(form, e.target);
      if (index + 1 < form.elements.length) {
        form.elements[index + 1].focus();
      } else {
        submitHandler();
      }
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      statusMessage={statusMessage}
      submitHandler={submitHandler}
      status={status}
      setStatus={setStatus}
      submitLabel={buttonCaptions.submit}
    >
      <div className='w-full inline-block'>
        <form>
          <TextInput
            htmlAttributes={{
              id: 'pg-endpoint',
              autoFocus: true,
              onKeyDown: handleKeyDown,
              'aria-label': 'Database Endpoint',
              placeholder: 'postgresql://hostname:5432/dbname',
            }}
            value={endpoint}
            isDisabled={false}
            label='Database Endpoint'
            isFluid={true}
            isRequired={true}
            onChange={(e) => setEndpoint(e.target.value)}
          />
          <div className='flex justify-between items-center w-full gap-4 mt-3'>
            <TextInput
              htmlAttributes={{
                id: 'pg-username',
                onKeyDown: handleKeyDown,
                'aria-label': 'Username',
                placeholder: '',
              }}
              value={username}
              isDisabled={false}
              label='Username'
              helpText='Optional'
              className='w-full'
              isFluid={true}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              htmlAttributes={{
                id: 'pg-password',
                type: 'password',
                onKeyDown: handleKeyDown,
                'aria-label': 'Password',
                placeholder: '',
              }}
              value={password}
              isDisabled={false}
              label='Password'
              helpText='Optional'
              className='w-full'
              isFluid={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default PostgreSQLModal;
