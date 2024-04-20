import { NextPage } from 'next';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { CreateJobModule } from './_modules/main';

const CreateJobPage: NextPage = (): ReactElement => {
  return <CreateJobModule />;
};

export default CreateJobPage;
