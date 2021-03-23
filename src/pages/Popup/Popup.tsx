import './Popup.less';
import { Button, Checkbox, Modal, Space, Spin } from 'antd';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { useEffect, useState } from "react";
import storageService from '@services/StorageService';
import { LoadingOutlined } from '@ant-design/icons';

enum FrameUrlType {
  Quiz = 'https://docs.google.com/forms/d/e/1FAIpQLSf5Kr-QMNfpYeG7OUIAipoCY9jDrrvuo1Z3AK8j5xMJ2GcyxQ/viewform?embedded=true', // Исследование
  Bug = 'https://docs.google.com/forms/d/e/1FAIpQLScgWPlrQqcxOdowTneH8Tv8m3jURkuiTk_5rGn8EN8rVRBCeg/viewform?embedded=true' // Баг
}

const Popup = () => {

  const profileCheckboxes = [
    {name: 'profile_videos'},
    {name: 'profile_Views'},
    {name: 'profile_Shares'},
    {name: 'profile_Comments'},
    {name: 'profile_rating_likes'},
    {name: 'profile_rating_shares'},
    {name: 'profile_rating_comments'},
    {name: 'profile_Average_likes'},
    {name: 'profile_Average_views'},
    {name: 'profile_Average_shares'},
    {name: 'profile_Average_comments'},
    {name: 'profile_Average_ER'},
    {name: 'profile_Average_created_time'},
    {name: 'profile_Average_videos_per_day'},
    {name: 'profile_top5_tags'}
  ]

  const videoCheckboxes = [
    {name: 'video_Views'},
    {name: 'video_Likes'},
    {name: 'video_Shares'},
    {name: 'video_Comments'},
    {name: 'video_ER'},
    {name: 'video_Sort_by_ER'},
  ]

  const [state, setState] = useState({
    show: false,
    loading: false,
    frameUrl: '',
  });

  const onCloseModal = () => setState(prevState => ({...prevState, show: false}));
  const hideSpinner = () => setState(prevState => ({...prevState, loading: false}));
  const onShowModal = (frameUrl: FrameUrlType) => setState(prevState => ({
    ...prevState,
    loading: state.frameUrl !== frameUrl, frameUrl, show: true
  }))

  const onInit = async () => {
    ReactGA.initialize('UA-186370775-1');
    ReactGA.ga('set', 'checkProtocolTask', null);
    ReactGA.pageview('/popup.html');

    const profileSettings = await Promise.all(profileCheckboxes.map(item => storageService.getItem(item.name)))
    setState(prevState => ({
      ...prevState,
      ...profileSettings
        .reduce((acc, curr, index) => ({[profileCheckboxes[index].name]: curr, ...acc}), {})
    }));

    const videoSettings = await Promise.all(videoCheckboxes.map(item => storageService.getItem(item.name)))
    setState(prevState => ({
      ...prevState,
      ...videoSettings
        .reduce((acc, curr, index) => ({[videoCheckboxes[index].name]: curr, ...acc}), {})
    }));
  }

  useEffect(() => {
    onInit();
  }, [])

  const onChange = async (e, storageName) => {
    setState(prevState => ({...prevState, [storageName]: e.target.checked}));

    await storageService.setItem(storageName, e.target.checked);

    // ym(storageName, e.target.checked ? 'enable' : 'disable');
    // ym('reachGoal', 'whateverGoal', {awesomeParameter: 42});
    ReactGA.event({
      category: storageName,
      action: e.target.checked ? 'enable' : 'disable',
    });
  }

  return (
    <div className="profile-container">
      {/*<YMInitializer accounts={[70946401]} options={{webvisor: true}} version="2" />*/}
      <div className="logo">
        <img src="../../images/icon_128x128.png" alt=""/>
        <h1>{chrome.i18n.getMessage("appName")}</h1>
      </div>
      <div className="checkbox-group">
        <h2>{chrome.i18n.getMessage('popup_profile_title')}</h2>
        <div className="checkbox-container">
          {profileCheckboxes.map(checkbox =>
            <Checkbox checked={state[checkbox.name]}
                      onChange={(e) => onChange(e, checkbox.name)}>{chrome.i18n.getMessage(checkbox.name)}</Checkbox>)}
        </div>
      </div>
      <div className="checkbox-group">
        <h2>{chrome.i18n.getMessage('popup_video_title')}</h2>
        <div className="checkbox-container">
          {videoCheckboxes.map(checkbox =>
            <Checkbox checked={state[checkbox.name]}
                      onChange={(e) => onChange(e, checkbox.name)}>{chrome.i18n.getMessage(checkbox.name)}</Checkbox>)}
        </div>
      </div>
      <Space>
        <a href="https://yoomoney.ru/to/410016200700541" target="_blank">{chrome.i18n.getMessage('donate')}</a>
        <Button type="primary" onClick={() => onShowModal(FrameUrlType.Quiz)}>
          Report bug
        </Button>
      </Space>
      <Modal
        width="fit-content"
        visible={state.show}
        onCancel={onCloseModal}
        footer={null}>
        <Spin spinning={state.loading} indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}>
          <iframe
            src={state.frameUrl}
            onLoad={hideSpinner}
            width="640" height="640" frameBorder="0" marginHeight={0} marginWidth={0}> Loading...
          </iframe>
        </Spin>
      </Modal>
    </div>
  );
}

export default Popup;