// src/pages/UsersPage.tsx
import Button from "../components/Button";

// Optionally specify the user type if you want stricter TypeScript checking
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
};

type UsersPageProps = {
  users?: User[];
};

const UsersPage = ({ users = [] }: UsersPageProps) => (
  <section className="space-y-6">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">Users</h2>
      <Button onClick={() => {/* add user logic */}}>Add User</Button>
    </div>
    <div className="bg-white rounded shadow p-6">
      {users.length === 0 ? (
        <div className="text-gray-500 text-center">No users found.</div>
      ) : (
        <table className="w-full table-auto">
          <thead className="bg-neutral-100">
            <tr>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-2">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center">{user.active ? "Active" : "Inactive"}</td>
                <td>
                  <Button size="sm" variant="outline">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </section>
);

export default UsersPage;
