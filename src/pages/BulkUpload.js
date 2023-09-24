// BulkUpload.js
import React from 'react';
import FileUpload from '../components/FileUpload'; // Make sure the path is correct
import Topbar from '../components/TopBar';

const BulkUpload = () => {
  return (
    <>
    <Topbar />
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-8 col-lg-6 card-ext">
            <>
              <strong>Bulk Upload</strong><br />
              Upload your file with the investor info. Make sure that you use the template file to add information.Do not change the headings in the template file.<br /><br />
              <FileUpload />
              <hr />
              Please note that the fields prefixed with <strong>*</strong> in the template file are mandatory.<br />
              <small>You can download the template file <a href="../upload-sample.xlsx" download>here</a>.</small>
            </>
        </div>
      </div>
    </div>
    </>
  );
};

export default BulkUpload;
