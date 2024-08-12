FactoryBot.define do
  factory :calendar do
    account_id { 1 }
    worker_id { 1 }
    uuid { "" }
    title { "MyString" }
    description { "MyString" }
    status { 1 }
  end
end
