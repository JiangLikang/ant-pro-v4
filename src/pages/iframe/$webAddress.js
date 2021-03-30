import React from 'react';
import Iframe from '@/components/Iframe';
import NoFoundPage from '../404';
import { joinUrl } from '@/utils/fn';

export default () => {
  let address = location.href.split('/iframe/').pop()
  if (address.indexOf('http-')<0&&address.indexOf('https-')<0) {
    return <NoFoundPage/>
  }
  address = address.split('-').join('://')                           
  return <Iframe src={joinUrl(address)} />;
};
