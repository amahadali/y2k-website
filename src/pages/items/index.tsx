import { useEffect, useState } from "react";

interface Item {
  _id: string;
  type: string;
  name: string;
  artistName?: string;
  developerName?: string;
  ringtone?: string;
  imageUrl: string;
  createdAt: string;
}

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items/fetch");
        const data = await response.json();

        if (data.success) {
          setItems(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h2>{item.name}</h2>
            <p>Type: {item.type}</p>
            {item.artistName && <p>Artist: {item.artistName}</p>}
            {item.developerName && <p>Developer: {item.developerName}</p>}
            {item.ringtone && <p>Ringtone: {item.ringtone}</p>}
            <img src={item.imageUrl} alt={item.name} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
