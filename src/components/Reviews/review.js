import React from 'react';
import './review.css';
import { RxAvatar } from "react-icons/rx";

const ReviewCard = ({ name, country, comment, rating }) => {
  return (
    <div className="review-card">
      
      <h4><RxAvatar /> {name} </h4>
      <p>{comment}</p>
      <div className="rating">Rating: {rating}/10</div>
    </div>
  );
};

const ServiceReviews = () => {
  const reviews = [
    { name: 'Lê Văn Quang', comment: 'Vị trí gần trung tâm, nhân viên thân thiện.', rating: 8.2 },
    { name: 'Nguyễn Quang Hiếu', comment: 'Phòng rẻ, gần các quán ăn.', rating: 8.0 },
    { name: 'Phan Công Hiếu', comment: 'Rất gần cảng biển và sân bay, nhân viên nhiệt tình.', rating: 9.0 },
    { name: 'Nguyễn Văn Vui', comment: 'Phòng rộng, đầy đủ tiện nghi.', rating: 8.5 },
  ];

  return (
    <div className="service-reviews">
      <h4>Nhận xét của những vị khách từng sử dụng dịch vụ tại nhà khách Hương Sen</h4>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            comment={review.comment}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceReviews;
