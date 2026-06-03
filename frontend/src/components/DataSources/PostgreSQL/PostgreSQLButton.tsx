import postgresqlLogo from '../../../assets/images/postgresql.svg';
import { DataComponentProps } from '../../../types';
import { buttonCaptions } from '../../../utils/Constants';
import CustomButton from '../../UI/CustomButton';

const PostgreSQLButton: React.FC<DataComponentProps> = ({ openModal, isLargeDesktop = true, isDisabled = false }) => {
  return (
    <CustomButton
      title={isLargeDesktop ? buttonCaptions.postgresql : ''}
      openModal={openModal}
      logo={postgresqlLogo}
      wrapperclassName=''
      className={!isLargeDesktop ? 'widthunset' : ''}
      isDisabled={isDisabled}
    />
  );
};

export default PostgreSQLButton;
