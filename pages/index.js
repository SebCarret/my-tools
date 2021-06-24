import { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import DbConnect from '../models/dbConnect';
import leadsModel from '../models/leads';
import TopMenu from '../components/TopMenu';
import { useDispatch } from 'react-redux'

const FormItem = Form.Item;
const Option = Select.Option;

const content = {
  // marginTop: 50,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center'
}

export default function Home({ lists }) {

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [list, setList] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {

    if (lists.length > 0) {
      let finalList = [];
      for (let list of lists) {
        finalList.push(list._id)
      };
      dispatch({ type: 'loadList', lists: finalList })
    }
  }, []);

  const onSelect = value => setList(value);

  const onSaveClick = async () => {

    setLoading(true);

    let user = JSON.stringify({
      firstname: firstname,
      lastname: lastname,
      company: company,
      list: list
    });

    let request = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/Json' },
      body: user
    });
    let response = await request.json();
    response.success
      ? message.success(response.message)
      : message.error(response.message)

    setLoading(false)
  };

  return (

    <div style={content}>
      <TopMenu />
      <h1>Enregistre un nouveau contact :</h1>
      {/* <div className="text-center mb-5">
        <Link href="#">
          <a className="logo mr-0">
            <SmileFilled size={48} strokeWidth={1} />
          </a>
        </Link>

        <p className="mb-0 mt-3 text-disabled">Welcome to the world !</p>
      </div> */}
      <div>
        <Form layout="vertical">

          <FormItem
            label="Prénom"
          >
            <Input
              size="large"
              placeholder="John"
              onChange={e => setFirstName(e.target.value)}
              value={firstname}
            />
          </FormItem>

          <FormItem
            label="Nom"
          >
            <Input
              size="large"
              placeholder="Doe"
              onChange={e => setLastName(e.target.value)}
              value={lastname}
            />
          </FormItem>

          <FormItem
            label="Société"
          >
            <Input
              size="large"
              placeholder="Facebook"
              onChange={e => setCompany(e.target.value)}
              value={company}
            />
          </FormItem>

          <FormItem
            label="Liste du contact"
          >
            <Select
              size="large"
              defaultValue="Sélectionne-en une"
              style={{ width: 192 }}
              onChange={onSelect}
            >
              <Option value="CEO">CEO</Option>
              <Option value="CTO">CTO</Option>
            </Select>
          </FormItem>

          <FormItem
            style={{ marginTop: 48 }}
          >
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={onSaveClick}
            >
              Enregistrer
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
};

export async function getServerSideProps() {
  await DbConnect();
  const aggregation = leadsModel.aggregate();
  aggregation.group({ _id: "$list" });
  const lists = await aggregation.exec();

  return {
    props: { lists }
  }
}
