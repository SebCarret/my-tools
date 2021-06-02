import { createRef } from 'react';
import { Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { CSVReader } from 'react-papaparse';

const buttonRef = createRef();

export default function UploadFile(props) {

    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e);
        }
    };

    const handleOnFileLoad = (data) => {

        let header = data[0].data;
        props.handleTempColumns(header);
        let finalDatas = [];
        for (let i = 1; i < data.length; i++) {
            let obj = {};
            obj.key = i - 1;
            for (let j = 0; j < data[i].data.length; j++) {
                obj[header[j]] = data[i].data[j]
            };
            finalDatas.push(obj)
        };
        props.handleDatasToRead(finalDatas)
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveFile = (data) => {
        props.handleFileRemoving()
    };

    const handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e);
        }
    };

    return (
        <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            onRemoveFile={handleOnRemoveFile}
        >
            {({ file }) => (
                !file
                    ? <Button
                        icon={<UploadOutlined />}
                        onClick={handleOpenDialog}
                        type="primary"
                    >
                        Browse file
                        </Button>
                    : <Button
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveFile}
                        danger
                    >
                        {file.name}
                    </Button>
            )}
        </CSVReader>
    )
};