import React from 'react';

const Footer = () => {

    return (
        <div className="row mt-5">
            <div className="col-12 col-md-6" style={{ textAlign: 'left', paddingLeft:'33px' }}>
                <p style={{fontWeight:'500'}}>Казинпрог, ТОО</p>
                <p className="mb-1" style={{fontWeight:'500'}}>Automatico support team phone number</p>
                <p>+7 (707) 759 1010</p>
            </div>

            <div className="col-12 col-md-6 pr-4 m-auto" style={{ textAlign: 'right' }}>
                <h5><p style={{fontWeight:'500', fontSize: '15px', paddingRight: '2%'}}>Ver. 1.05.2-12OCT2020</p></h5>
            </div>
        </div>
    )
}

export default Footer;