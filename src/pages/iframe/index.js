import React from 'react';
import Iframe from '@/components/Iframe';
import NoFoundPage from '../404';
import { joinUrl } from '@/utils/fn';

export default ({
  location: {
    query: { target, ...rest },
  },
}) => {
  if (!target) {
    return <NoFoundPage />;
  }

  return <Iframe src={joinUrl(target, rest)} />;
};
