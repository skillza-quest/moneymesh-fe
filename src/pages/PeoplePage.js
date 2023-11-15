import React, { useState, useEffect } from 'react';
import Topbar from '../components/TopBar';
import icProfile from '../assets/ic-profile.png'
import BackButton from '../components/BackButton';
export const PeoplePage = () => {
    const [investors, setInvestors] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/investors/`); // Replace with your endpoint
            const data = await response.json();
            setInvestors(data);
        };
        fetchData();
    }, []);

    const filteredInvestors = investors.filter(person => 
        (person.primaryContactName && person.primaryContactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <Topbar />
            <div className='container'>
                <div className='row mb-3'>
                    <div className='col-12 col-md-1'>
                        <BackButton />
                    </div>
                    <div className='col-12 col-md-10'>
                        <div className='row'>
                            <div className='row'>
                                <div className="col-12 col-md-4">
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='mb-2'>
                                                    <h3>People</h3><br />
                                        </div>
                                    </div>
                                </div>
                                    <input 
                                        type="text"
                                        className='form-control' 
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    /><br /><br />
                                </div>
                            </div>
                        {filteredInvestors.map(person => (
                            <div className='col-12 col-md-6 col-lg-4 pb-4'>
                                <div key={person._id.$oid} className="card-ext mb-3">
                                    <div className="profile-section">
                                        <div className="row">
                                            <div className="col-12 d-flex align-items-center">
                                                <img src={icProfile} width="60px" className="mr-3" alt="Profile" />
                                                <div>
                                                    {person.primaryContactName && (
                                                        <div>
                                                            <strong>{person.primaryContactName}</strong><br />
                                                            {person.primaryContactPosition}<br />
                                                            {person.name}
                                                        </div>
                                                    )}
                                                    {person.contactEmail && <div>{person.contactEmail}</div>}
                                                    {person.contactPhone && <div>{person.contactPhone.$numberLong}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default PeoplePage;
