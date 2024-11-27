<?php

namespace Database\Seeders;

use App\Models\Customer\BillingInfo as CustomerBillingInfo;
use App\Models\Customer\Customer;
use App\Models\Customer\ShippingInfo as CustomerShippingInfo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    private $testUserUsername;
    private $testUserEmail;
    private $testUserPassword;
    private $created_at;
    private $updated_at;

    public function __construct()
    {
        $this->testUserUsername = env('TEST_USER_USERNAME');
        $this->testUserEmail = env('TEST_USER_EMAIL');
        $this->testUserPassword = Hash::make(env('TEST_USER_PASSWORD'));
        $this->created_at = $this->updated_at = Carbon::now()->format('Y-m-d H:i:s');
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        DB::table('users')->insert([
            'username' => $this->testUserUsername,
            'email' => $this->testUserEmail,
            'password' => $this->testUserPassword
        ]);
        DB::table('customers')->insert([
            'user_id' => 1,
            'username' => $this->testUserUsername,
            'email' => $this->testUserEmail,
            'password' => $this->testUserPassword
        ]);

        foreach (range(1, 20) as $index) {
            $username = $faker->userName();
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();
            $emailDomain = $faker->freeEmailDomain();
            $email = strtolower("$firstName.$lastName@$emailDomain");
            $password = Hash::make('password');

            DB::table('users')->insert([
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ]);
            $user = User::where('username', '=', $username)->first();

            DB::table('customers')->insert([
                'user_id' => $user->id,
                'username' => $user->username,
                'email' => $email,
                'password' => $password,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'date_of_birth' => $faker->dateTime('January 1, 2002'),
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ]);
            $customer = Customer::where('username', '=', $username)->first();

            $billingInfo = new CustomerBillingInfo();
            $billingInfo->cardholder = "$customer->first_name $customer->last_name";
            $billingInfo->card_type = $faker->creditCardType();
            $billingInfo->card_number = $faker->creditCardNumber($billingInfo->card_type);
            $billingInfo->card_expiration_date = $faker->creditCardExpirationDateString();
            $billingInfo->cvv = $faker->randomNumber(3, true);
            $customer->billingInfo()->save($billingInfo);

            $shippingInfo = new CustomerShippingInfo();
            $shippingInfo->first_name = $customer->first_name;
            $shippingInfo->last_name = $customer->last_name;
            $shippingInfo->email = $customer->email;
            $shippingInfo->city = $faker->city();
            $shippingInfo->street_and_number = $faker->address();
            $shippingInfo->postal_code = $faker->randomNumber(4, true);
            $shippingInfo->country = $faker->country();
            $shippingInfo->phone_number = $faker->phoneNumber();
            $customer->shippingInfo()->save($shippingInfo);
        }
    }
}