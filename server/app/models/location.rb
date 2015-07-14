class Location < ActiveRecord::Base

  has_many :answers
  has_many :users, through: :answers
  
end
