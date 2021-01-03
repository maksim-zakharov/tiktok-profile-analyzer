import './App.scss';
import 'antd/dist/antd.css';
import {Checkbox} from 'antd';
import * as React from 'react';
import ReactGA from 'react-ga';
import { YMInitializer } from 'react-yandex-metrika';
import ym from 'react-yandex-metrika';

class Popup extends React.Component {

    async componentDidMount() {
        ReactGA.initialize('UA-186370775-1');
        ReactGA.ga('set', 'checkProtocolTask', null);
        ReactGA.pageview('/popup.html');

        const profileCheckboxes = await Promise.all(this.profileCheckboxes.map(item => getItem(item.name)))
        this.setState(profileCheckboxes.reduce((acc, curr, index) => ({[this.profileCheckboxes[index].name]: curr, ...acc}), {}));

        const videoCheckboxes = await Promise.all(this.videoCheckboxes.map(item => getItem(item.name)))
        this.setState(videoCheckboxes.reduce((acc, curr, index) => ({[this.videoCheckboxes[index].name]: curr, ...acc}), {}));
    }

    profileCheckboxes = [
        {name: 'profile_Views'},
        {name: 'profile_Shares'},
        {name: 'profile_Comments'},
        {name: 'profile_Average_views'},
        {name: 'profile_Average_shares'},
        {name: 'profile_Average_comments'},
        {name: 'profile_Average_ER'},
        {name: 'profile_Average_created_time'},
        {name: 'profile_Average_videos_per_day'}
    ]

    videoCheckboxes = [
        {name: 'video_Likes'},
        {name: 'video_Shares'},
        {name: 'video_Comments'},
        {name: 'video_ER'},
        {name: 'video_Sort_by_ER'},
    ]

    state = {};

    render() {
        return (
            <div className="profile-container">
                {/*<YMInitializer accounts={[70946401]} options={{webvisor: true}} version="2" />*/}
                <div className="logo">
                    <img src="../images/icon_128x128.png" alt=""/>
                    <h1>Tiktok Profile Analyzer</h1>
                </div>
                <div className="checkbox-group">
                    <h2>{chrome.i18n.getMessage('popup_profile_title')}</h2>
                    <div className="checkbox-container">
                        {this.profileCheckboxes.map(checkbox =>
                            <Checkbox checked={this.state[checkbox.name]}
                                      onChange={(e) => this.onChange(e, checkbox.name)}>{chrome.i18n.getMessage(checkbox.name)}</Checkbox>)}
                    </div>
                </div>
                <div className="checkbox-group">
                    <h2>{chrome.i18n.getMessage('popup_video_title')}</h2>
                    <div className="checkbox-container">
                        {this.videoCheckboxes.map(checkbox =>
                            <Checkbox checked={this.state[checkbox.name]}
                                      onChange={(e) => this.onChange(e, checkbox.name)}>{chrome.i18n.getMessage(checkbox.name)}</Checkbox>)}
                    </div>
                </div>
                <a href="https://yoomoney.ru/to/410016200700541" target="_blank">{chrome.i18n.getMessage('donate')}</a>
            </div>
        );
    }

    async onChange(e, storageName) {
        this.state[storageName] = e.target.checked;
        this.setState(this.state);

        await setItem(storageName, this.state[storageName]);

        // ym(storageName, e.target.checked ? 'enable' : 'disable');
        // ym('reachGoal', 'whateverGoal', {awesomeParameter: 42});
        ReactGA.event({
            category: storageName,
            action: e.target.checked ? 'enable' : 'disable',
        });
    }
}

async function getItem(name) {
    if (!chrome?.storage) {
        return localStorage.getItem(name);
    }
    return new Promise(resolve => {
        chrome.storage.sync.get(name, data => {
            resolve(data[name]);
        });
    });
}

async function setItem(name, value) {
    if (!chrome?.storage) {
        return localStorage.setItem(name, value);
    }
    return new Promise(resolve => {
        chrome.storage.sync.set({[name]: value}, data => {
            resolve(data);
            console.log(data);
        });
    });
}


export default Popup;
