import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import moment from 'moment';

const CreateMandate = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    companyName: '',
    roundSize: '',
    roundType: ''
});
const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

function formatAmount(amount) {
  if (amount >= 1000000) {
      const inMillions = amount / 1000000;
      return (inMillions % 1 === 0 ? inMillions.toFixed(0) : inMillions.toFixed(1)) + 'M';
  } else if (amount >= 1000) {
      const inThousands = amount / 1000;
      return (inThousands % 1 === 0 ? inThousands.toFixed(0) : inThousands.toFixed(1)) + 'k';
  } else {
      return amount.toString();
  }
}

const onSubmit = async e => {
  e.preventDefault();
    const { companyName, roundSize, roundType } = formData;
    const currentDate = moment().format('MMM YY');
    let mandateFullName = companyName + ' - ' + formatAmount(roundSize) + ' (' + currentDate + ')';
    const newMandate = {
        mandateName: mandateFullName,
        companyName: companyName,
        roundSize: roundSize,
        roundType: roundType,
        creatorId: userId,
        investors: [] 
    };
    
    try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/mandates/create`, newMandate);
        console.log('New mandate created:', response.data);
        navigate('/mandates/' + response.data._id + '/modify-investors');
    } catch (error) {
        console.error('Could not create mandate:', error);
    }
};
  return (
    <>
    <TopBar />
    <div className="container">
        <div className="row justify-content-center">
          <div className='col-12 col-md-6 mb-2'>
                  <div className='flat-card' style={{position:'relative'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className='mb-2'>
                        <h3>Create Mandate</h3><br />
                        Start by giving basic information about the mandate. In the next step, you will be able to add investors to this mandate.<br /><br />
                      </div>
                      <form onSubmit={e => onSubmit(e)}>
                        <div>
                            <label>Company Name</label><br />
                            <input
                                type="text"
                                className='form-control'
                                name="companyName"
                                style={{width: 300}}
                                value={formData.companyName}
                                onChange={e => onChange(e)}
                                maxLength="50"
                                required
                            />
                        </div><br />
                        <div>
                            <label>Round Size in USD</label><br />
                            <input
                                type="number"
                                name="roundSize"
                                style={{width: 200}}
                                className='form-control'
                                value={formData.roundSize}
                                onChange={e => onChange(e)}
                                step="1000"
                                required
                            />
                        </div><br />
                        <div>
                            <label>Round Type</label><br />
                            <select name="roundType" style={{width: 300}} className='form-control' value={formData.roundType} onChange={e => onChange(e)} required>
                                <option value="">Select Round Type</option>
                                <option value="Pre-seed">Pre-seed</option>
                                <option value="Seed">Seed</option>
                                <option value="Accelerator">Accelerator</option>
                                <option value="Angel">Angel</option>
                                <option value="Bridge">Bridge</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B">Series B</option>
                                <option value="Series C">Series C</option>
                            </select>
                        </div><br /><br />
                        <button className='btn btn-primary' style={{width: 300}} type="submit">Create Mandate</button>
                    </form>             
                    </div>
                    <div className="illustration d-none d-md-block"></div>
                  </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default CreateMandate;
