const ProductUsersList = ({ users }) => {
  return (
    <div className="max-h-64 overflow-y-auto border border-gray-700 rounded-lg p-4">
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className="bg-gray-900 p-4 rounded-md mb-3 text-white border border-gray-700 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-400">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Department:</span>{" "}
                  {user.department}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Roll No:</span>{" "}
                  {user.rollNumber}
                </p>
              </div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                Quantity: {user.quantity}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No users found</p>
      )}
    </div>
  );
};

export default ProductUsersList;
