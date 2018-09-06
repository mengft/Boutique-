/*
 * @Author: fantao.meng 
 * @Date: 2018-09-06 10:26:04 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2018-09-06 15:40:09
 */

import React, { ReactNode } from 'react';
import * as PropTypes from 'prop-types';
import { ScrollView, NativeModules, findNodeHandle } from 'react-native';
import { px2dp, ThemeStyles } from '../Theme';

export default class KeyboardAvoidingView extends React.Component {
    
    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
    };

    static defaultProps = {
        style: {}
    };

    /**
     * TextInput 获取焦点
     * @param {*} nativeEvent 
     */
    onFocus(e) {
        let target = e.nativeEvent.target;
		NativeModules.UIManager.measure(target, (x, y, width, height, pageX, pageY) => {
            // console.log('x=' + x + '--y=' + y + '--width=' + width + '--height=' + height + '--pageX=' + pageX + '--pageY=' + pageY);
            this.keyboardAvoidingView.scrollResponderScrollNativeHandleToKeyboard(
                findNodeHandle(target), height, true
            )
        })
    }

    render () {
        return (
            <ScrollView 
                ref={e => { if (e) this.keyboardAvoidingView = e }}
                keyboardDismissMode='on-drag'
                style={[ThemeStyles.container, { paddingLeft: px2dp(30) }, this.props.style]}
            >
                {React.Children.map(this.props.children, child => {
                    let props = {
                        ...child.props,
                        onFocus: (e) => {
                            this.onFocus(e);
                            if (typeof child.props.onFocus === 'function') child.props.onFocus();
                        },
                    };
                    return React.cloneElement(child, props);
                })}
            </ScrollView>
        )
    }
}

/**
 * KeyboardAvoidingView 解决位于ScrollView的Form表单输入框被键盘遮盖的情况，官网的组件目前问题较多，暂时不具备使用条件
 */