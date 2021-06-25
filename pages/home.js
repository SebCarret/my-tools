import { useState, useEffect } from 'react';
// import { Form, Select, Input, Button, message } from 'antd';
import DbConnect from '../models/dbConnect';
import leadsModel from '../models/leads';
import TopMenu from '../components/TopMenu';
import LoadingDatas from '../components/LoadingDatas';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const content = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center'
}

export default function Home({ lists }) {

  const [loadingDatas, setLoadingDatas] = useState(true);
  const admin = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {

    if (typeof window !== 'undefined'){
      const admin = window.localStorage.admin;
      if (admin){
        dispatch({type: 'login', admin: JSON.parse(admin)});
        setLoadingDatas(false)
      } else {
        router.push('/')
      }
    }
    
    if (lists.length > 0) {
      let finalList = [];
      for (let list of lists) {
        finalList.push(list._id)
      };
      dispatch({ type: 'loadList', lists: finalList })
    };
  }, []);

  if (loadingDatas){
    return <LoadingDatas />
  } else {
    return (
      <div style={content}>
        <TopMenu />
        <h1>Welcome {admin.firstname}</h1>
      </div>
    )
  }
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
