import React, { useState, useEffect } from 'react';
import CollapsibleBlock from '../../../components/CollapsibleBlock.jsx';
import UserService from '../../../services/UserService.js';
import TokenManager from '../../../services/TokenManager.js';
import LocationService from '../../../services/LocationService.js';
import toast, { Toaster } from 'react-hot-toast';

function Settings() {
  const [userInfo, setUserInfo] = useState({
    firstName: 'not set yet',
    lastName: 'not set yet',
    city: 'not set yet',
    age: 'not set yet',
    gender: 'not set yet',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await UserService.getUser(TokenManager.getUserId());
        setUserInfo({
          firstName: data.userInformation.firstName || 'not set yet',
          lastName: data.userInformation.lastName || 'not set yet',
          city: data.userInformation.city || 'not set yet',
          age: data.userInformation.age || 'not set yet',
          gender: data.userInformation.gender || 'not set yet',
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFieldChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleSave = async (field, value) => {
    const userData = { [field]: value };
    try {
      console.log(`UserId: ${TokenManager.getUserId()}, Data: ${JSON.stringify(userData)}`);
      await UserService.updateUser(TokenManager.getUserId(), userData);
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Error updating ${field}`);
    }
  };

  const handlePasswordSave = async (newPassword) => {
    try {
      await UserService.updateUser(TokenManager.getUserId(), { ['password']: newPassword});
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <Toaster />
      <CollapsibleBlock title="First Name" onSave={() => handleSave('firstName', userInfo.firstName)}>
        <FirstNameForm initialData={userInfo.firstName} onFieldChange={(value) => handleFieldChange('firstName', value)} />
      </CollapsibleBlock>
      <CollapsibleBlock title="Last Name" onSave={() => handleSave('lastName', userInfo.lastName)}>
        <LastNameForm initialData={userInfo.lastName} onFieldChange={(value) => handleFieldChange('lastName', value)} />
      </CollapsibleBlock>
      <CollapsibleBlock title="City" onSave={() => handleSave('city', userInfo.city)}>
        <CityForm initialData={userInfo.city.name} onFieldChange={(value) => handleFieldChange('city', value)}/>
      </CollapsibleBlock>
      <CollapsibleBlock title="Age" onSave={() => handleSave('age', userInfo.age)}>
        <AgeForm initialData={userInfo.age} onFieldChange={(value) => handleFieldChange('age', value)}/>
      </CollapsibleBlock>
      <CollapsibleBlock title="Gender" onSave={() => handleSave('gender', userInfo.gender)}>
        <GenderForm initialData={userInfo.gender} onFieldChange={(value) => handleFieldChange('gender', value)} />
      </CollapsibleBlock>
      <CollapsibleBlock title="Change Password" onSave={(newPassword) => handlePasswordSave(newPassword)}>
        <PasswordForm onSave={(handlePasswordSave)}/>
      </CollapsibleBlock>
    </div>
  );
}

const useForm = (initialData) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return [data, setData];
};

const FirstNameForm = ({ isEditing, initialData, onFieldChange }) => {
  const [firstName, setFirstName] = useForm(initialData);

  const handleChange = (e) => {
    setFirstName(e.target.value);
    onFieldChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">First Name</label>
        <input
          type="text"
          className="border p-2 rounded w-1/3"
          value={firstName}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

const LastNameForm = ({ isEditing, initialData, onFieldChange }) => {
  const [lastName, setLastName] = useForm(initialData);

  const handleChange = (e) => {
    setLastName(e.target.value);
    onFieldChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Last Name</label>
        <input
          type="text"
          className="border p-2 rounded w-1/3"
          value={lastName}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

const CityForm = ({ isEditing, initialData, onFieldChange }) => {
  const [city, setCity] = useForm(initialData);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityDisabled, setCityDisabled] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      try {
        const districtsData = await LocationService.getAllLocations();
        setDistricts(districtsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }

    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      setCities(selectedDistrict.cities);
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (event) => {
    const districtId = Number(event.target.value);
    if (districtId === 0) {
      setSelectedDistrict(null);
      setCities([]);
      setCityDisabled(true);
    } else {
      const district = districts.find((distr) => distr.id === districtId);
      setSelectedDistrict(district);
      setCityDisabled(false);
    }
  };

  const handleCityChange = (event) => {
    const cityId = Number(event.target.value);
    if (cityId === 0) {
      setCity('');
    } else {
      const selectedCity = cities.find((c) => c.id === cityId);
      setCity(selectedCity.name);
      onFieldChange(selectedCity.id);
    }
  };

  return (
    <div className="space-y-4">
      {!isEditing ? (
        <div>
          <label className="block mb-2 font-semibold text-gray-700">City</label>
          <input
            type="text"
            className="border p-2 rounded w-1/3"
            value={city}
            onChange={handleCityChange}
            disabled
          />
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">District</label>
            <select onChange={handleDistrictChange} className="border p-2 rounded w-1/3">
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">City</label>
            <select onChange={handleCityChange} disabled={cityDisabled} className="border p-2 rounded w-1/3">
              <option value="" disabled={cityDisabled}>
                Select a city
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

const AgeForm = ({ isEditing, initialData, onFieldChange }) => {
  const [age, setAge] = useForm(initialData);

  const handleChange = (e) => {
    setAge(e.target.value);
    onFieldChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Age</label>
        <input
          type="number"
          className="border p-2 rounded w-1/3"
          value={age}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

const GenderForm = ({ isEditing, initialData, onFieldChange }) => {
  const [gender, setGender] = useForm(initialData);

  const handleChange = (e) => {
    setGender(e.target.value);
    onFieldChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Gender</label>
        <select
          className="border p-2 rounded w-1/3"
          value={gender}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
    </div>
  );
};

const PasswordForm = ({ isEditing, onSave }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const upperCase = /[A-Z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidation({
      length,
      upperCase,
      number,
      specialChar,
    });

    return length && upperCase && number && specialChar;
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (!isEditing) {
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isEditing]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">New Password</label>
        <input
          type="password"
          className="border p-2 rounded w-1/3"
          value={newPassword}
          onChange={handlePasswordChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="border p-2 rounded w-1/3"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          disabled={!isEditing}
        />
      </div>
      {isEditing && (
        <div className="password-requirements">
          <p>Password must include:</p>
          <ul>
            <li className={passwordValidation.length ? 'text-green-500' : 'text-red-500'}>
              {passwordValidation.length ? '✔' : '✖'} At least 8 characters
            </li>
            <li className={passwordValidation.upperCase ? 'text-green-500' : 'text-red-500'}>
              {passwordValidation.upperCase ? '✔' : '✖'} An uppercase letter
            </li>
            <li className={passwordValidation.number ? 'text-green-500' : 'text-red-500'}>
              {passwordValidation.number ? '✔' : '✖'} A number
            </li>
            <li className={passwordValidation.specialChar ? 'text-green-500' : 'text-red-500'}>
              {passwordValidation.specialChar ? '✔' : '✖'} A special character
            </li>
          </ul>
        </div>
      )}
      {isEditing && newPassword !== confirmPassword && (
        <p className="text-red-500">Passwords do not match</p>
      )}
    </div>
  );
};

export default Settings;