import Button from "../components/Button";

type Vendor = {
  business_name?: string;
  is_verified?: boolean;
};

type SettingsPageProps = {
  vendor?: Vendor;
  onUpdateProfile?: () => void;
};

const SettingsPage = ({
  vendor = {},
  onUpdateProfile = () => {},
}: SettingsPageProps) => (
  <section className="space-y-6">
    <h2 className="text-xl font-bold">Settings</h2>
    <div className="bg-white rounded shadow p-6">
      <div className="mb-4">
        <div>
          Business Name: <span className="font-medium">{vendor.business_name ?? "N/A"}</span>
        </div>
        <div>Verified: {vendor.is_verified ? "Yes" : "No"}</div>
      </div>
      <Button variant="outline" onClick={onUpdateProfile}>Update Profile</Button>
    </div>
  </section>
);

export default SettingsPage;
