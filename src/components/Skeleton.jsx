import React from "react";

export const ProductCardSkeleton = () => (
  <div className="product-card skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line medium" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="skeleton skeleton-banner" />
);

export const CategorySkeleton = () => (
  <div className="cat-skeleton-row">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="skeleton skeleton-category" />
    ))}
  </div>
);
