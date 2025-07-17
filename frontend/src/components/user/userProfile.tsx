import React, { useEffect, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface IVendor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  is_blocked: boolean;
  is_googleuser: boolean;
  address?: string;
}

export const UserDetails: React.FC = () => {
  const [vendorData, setVendorData] = useState<IVendor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({
    house: '',
    post: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  });
  const [editDetails, setEditDetails] = useState<IVendor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState({
    house: '',
    post: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  });
  const id = useSelector((state: RootState) => state.auth.user?._id);
  useEffect(() => {
    // Simulate an API call to fetch vendor data
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/fetchuser`, {
          params: {id},
        }); // Replace with your API endpoint
      
         
          setVendorData(response.data.data);
       
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };

    fetchVendorData();
  }, []);


  const handleSubmitEditDetails = async () => {
    try {
      const response = await fetch('/api/vendor/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDetails),
      });

      if (response.ok) {
        setVendorData(editDetails);
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to update vendor details');
      }
    } catch (error) {
      console.error('Error updating vendor details:', error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newError = { house: '', post: '', city: '', pincode: '', district: '', state: '' };

    if (!address.house.trim()) {
      newError.house = 'House/Street name is required';
      valid = false;
    }
    if (!address.post.trim()) {
      newError.post = 'Post name is required';
      valid = false;
    }
    if (!address.city.trim()) {
      newError.city = 'City name is required';
      valid = false;
    }
    if (!/^[0-9]{7}$/.test(address.pincode)) {
      newError.pincode = 'Pincode must be a 7-digit number';
      valid = false;
    }
    if (!address.district.trim()) {
      newError.district = 'District name is required';
      valid = false;
    }
    if (!address.state.trim()) {
      newError.state = 'State name is required';
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleAddAddress = () => {
    if (validateForm()) {
      const fullAddress = `${address.house}, ${address.post}, ${address.city}, pin:${address.pincode}, ${address.district}, ${address.state}`;
      setVendorData((prev) => (prev ? { ...prev, address: fullAddress } : null));
      setAddress({ house: '', post: '', city: '', pincode: '', district: '', state: '' });
      setIsOpen(false);
    }
  };

  const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50/80 transition-colors">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-base text-gray-900">{value || 'Data is not available'}</p>
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 mx-auto p-6 space-y-8" style={{ marginTop: '2cm' }}>
      {/* Hero Section */}
      <div className="relative h-72 rounded-xl overflow-hidden">
        <div className="absolute inset-0" />
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url("/bg.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">{vendorData?.name || 'Data is not available'}</h1>
          <div className="h-px w-24 bg-white/30 mb-4" />
        </div>
      </div>

      {/* Profile Details */}
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-start p-6">
          <div>
            <h2 className="text-2xl font-semibold">Profile Details</h2>
          </div>
          <Button 
            color="primary"
            variant="bordered"
            endContent={<Pencil className="w-4 h-4" />}
            onPress={() => setIsOpen(true)}
          >
            Add Address
          </Button>
          <Button
              color="primary"
              variant="solid"
              endContent={<Pencil className="w-4 h-4" />}
              onPress={() => {
                setEditDetails(vendorData);
                setIsEditModalOpen(true);
              }}
            >
              Edit Details
            </Button>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Email Address" value={vendorData?.email} />
            <InfoItem label="Phone Number" value={vendorData?.mobile} />
            <InfoItem label="Address" value={vendorData?.address} />
          </div>
        </CardBody>
      </Card>

       {/* Edit Modal */}
       <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
        scrollBehavior="inside"
        backdrop="blur"
        className="z-50"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "bg-gray-100/80 border-gray-200 rounded-xl",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Details</ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  value={editDetails?.name || ''}
                  onChange={(e) => setEditDetails({ ...editDetails, name: e.target.value } as IVendor)}
                />
                <Input
                  label="Email"
                  value={editDetails?.email || ''}
                  onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value } as IVendor)}
                />
                <Input
                  label="Phone"
                  value={editDetails?.mobile || ''}
                  onChange={(e) => setEditDetails({ ...editDetails, mobile: e.target.value } as IVendor)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="success" onPress={handleSubmitEditDetails}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Address Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size="lg"
        scrollBehavior="inside"
        backdrop="blur"
        className="z-50"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "bg-gray-100/80 border-gray-200 rounded-xl",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-extrabold">Add Address</h2>
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-6">
                  <div>
                    <p className="text-sm mb-2 font-bold">House/Street Name</p>
                    <Input
                      value={address.house}
                      onChange={(e) => setAddress({ ...address, house: e.target.value })}
                      variant="bordered"
                      placeholder="Enter house/street name"
                    />
                    {error.house && <p className="text-red-500 text-sm">{error.house}</p>}
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-bold">Post</p>
                    <Input
                      value={address.post}
                      onChange={(e) => setAddress({ ...address, post: e.target.value })}
                      variant="bordered"
                      placeholder="Enter post"
                    />
                    {error.post && <p className="text-red-500 text-sm">{error.post}</p>}
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-bold">City</p>
                    <Input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      variant="bordered"
                      placeholder="Enter city"
                    />
                    {error.city && <p className="text-red-500 text-sm">{error.city}</p>}
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-bold">Pincode</p>
                    <Input
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      variant="bordered"
                      placeholder="Enter pincode"
                    />
                    {error.pincode && <p className="text-red-500 text-sm">{error.pincode}</p>}
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-bold">District</p>
                    <Input
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      variant="bordered"
                      placeholder="Enter district"
                    />
                    {error.district && <p className="text-red-500 text-sm">{error.district}</p>}
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-bold">State</p>
                    <Input
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      variant="bordered"
                      placeholder="Enter state"
                    />
                    {error.state && <p className="text-red-500 text-sm">{error.state}</p>}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className="font-extrabold" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="success" 
                  className="rounded-xl text-white font-extrabold px-3"
                  onPress={handleAddAddress}
                >
                  Add Address
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserDetails;
