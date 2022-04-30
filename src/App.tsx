import React from 'react';
import { Layout, Space } from 'antd';
import MyHeader from './componments/MyHeader';
import MyCarousel from './componments/MyCarousel';
import MyCollapse from './componments/MyCollapse';
import './Base.less'
import './App.less'
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const { Content, Footer } = Layout;

function App() {
  return (
    <Layout className="container">
      <MyHeader />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <MyCarousel />
            <MyCollapse />
          </Space>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
}

export default App;