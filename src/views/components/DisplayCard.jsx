import React from 'react';

const DisplayCard = ({ selectedPackage, post, maxTrainingDays }) => {
  return (
    <div className="row g-0">
      <h6
        className="d-flex justify-content-center p-0"
        style={{ color: '#C58C4F' }}
      >
        {selectedPackage}
      </h6>

      <div className="col text-center mb-1">
        <p className="card-title">Branches</p>
        <p
          className="card-text mb-0"
          style={{ color: '#C58C4F', fontSize: '14px' }}
        >
          {post.branchCount}
        </p>
      </div>

      <div className="col text-center">
        <p className="card-title mb-1">Users</p>
        <p
          className="card-text mb-0"
          style={{ color: '#C58C4F', fontSize: '14px' }}
        >
          {post.userCount}
        </p>
      </div>

      <div className="col text-center">
        <p className="card-title mb-1">Training Sessions</p>
        <p
          className="card-text mb-0"
          style={{ color: '#C58C4F', fontSize: '14px' }}
        >
          {maxTrainingDays[selectedPackage] || ''}
        </p>
      </div>
    </div>
  );
};

export default DisplayCard;
