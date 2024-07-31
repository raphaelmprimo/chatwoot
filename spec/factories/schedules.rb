FactoryBot.define do
  factory :schedule do
    subject { "MyString" }
    start_time { "2024-07-24 17:11:41" }
    end_time { "2024-07-24 17:11:41" }
    is_all_day { false }
    is_block { false }
    is_readonly { false }
    room_id { 1 }
    resource_id { 1 }
  end
end
