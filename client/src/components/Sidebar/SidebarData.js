// SidebarData.js
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

const getSidebarData = ({ userId, deviceId }) => {
  return [
    {
      title: `User ID: ${userId}`,
      icon: <FaIcons.FaUserCircle />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpen: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Log Out',
          icon: <MdIcons.MdOutlineLogout />,
          path: '/',
        }
      ]
    },
    {
      title: 'Buy Product',
      icon: <FaIcons.FaCartPlus />,
      path: `/another-device-info/${userId}/${deviceId}`,
    },
    {
      title: 'Device Information',
      icon: <MdIcons.MdPermDeviceInformation />,
      path: `/device-info/${userId}/${deviceId}`,
    },
    {
      title: 'Subscription',
      icon: <MdIcons.MdSubscriptions />
    },
    {
      title: 'Contact Us',
      icon: <IoIcons.IoMdContact />,
      path: 'https://iotaii.com/',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
  ];
};

export default getSidebarData;
