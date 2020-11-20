import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import useMergeValue from 'use-merge-value';
import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { history } from 'umi';

const HeaderSearch = (props) => {
  const {
    className,
    defaultValue,
    onVisibleChange,
    placeholder,
    open,
    defaultOpen,
    ...restProps
  } = props;
  const inputRef = useRef(null);
  const [value, setValue] = useMergeValue(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });
  const [searchMode, setSearchMode] = useMergeValue(defaultOpen || false, {
    value: props.open,
    onChange: onVisibleChange,
  });
  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });
  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    let Option = []
    props.options.map(item => {
      if (item.value.split('@@')[0].indexOf(searchText)>-1&&searchText!=='') {
        Option.push(item)
      }
    })
    setOptions(Option)
  };

  const onSelect = (data) => {
    history.push(data.split('@@')[1])
    setValue('')
  };

  return (
    <div
      className={classNames(className, styles.headerSearch)}
      onClick={() => {
        setSearchMode(true);

        if (searchMode && inputRef.current) {
          inputRef.current.focus();
        }
      }}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          if (onVisibleChange) {
            onVisibleChange(searchMode);
          }
        }
      }}
    >
      <SearchOutlined
        key="Icon"
        style={{
          cursor: 'pointer',
        }}
      />
      <AutoComplete
        key="AutoComplete"
        className={inputClass}
        value={value}
        style={{
          height: 28,
          marginTop: -6,
        }}
        options={options}
        onChange={setValue}
        onSearch={onSearch}
        onSelect={onSelect}
      >
        <Input
          ref={inputRef}
          defaultValue={defaultValue}
          aria-label={placeholder}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
          onBlur={() => {
            setSearchMode(false);
          }}
          style={{paddingLeft: '10px'}}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
