import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = "w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform active:scale-95 shadow-md";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white border-b-4 border-blue-700",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 border-b-4 border-gray-400",
    success: "bg-green-500 hover:bg-green-600 text-white border-b-4 border-green-700",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    />
  );
};