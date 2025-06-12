import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const pathSnippets = location.pathname.split('/').filter(i => i);
  
  const breadcrumbItems = [
    {
      key: 'home',
      title: (
        <Link to="/">
          <HomeOutlined /> {t('nav.home')}
        </Link>
      ),
    },
  ];

  pathSnippets.forEach((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSnippets.length - 1;
    
    let title = snippet;
    
    // Translate common paths
    if (snippet === 'drones') title = t('categories.drones');
    else if (snippet === 'robots') title = t('categories.robots');
    else if (snippet === 'agricultural') title = t('categories.agricultural');
    else if (snippet === 'industrial') title = t('categories.industrial');
    else if (snippet === 'other') title = t('categories.other');
    
    breadcrumbItems.push({
      key: url,
      title: isLast ? title : <Link to={url}>{title}</Link>,
    });
  });

  return (
    <div className="py-4">
      <AntBreadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumb;