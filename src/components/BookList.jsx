import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';

export default function BookList(props) {
  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: "Cover",
      dataIndex: 'coverUrl',
      render: (text) => <Image src={`http://localhost:3080/${text}`} height={100} fallback="https://via.placeholder.com/100?text=No+Image" />,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => (
        <Tag color="blue">{value?.name || 'ไม่มีหมวดหมู่'}</Tag>
      ),
    },
    { title: 'Liked', dataIndex: 'likeCount', key: 'likeCount' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space>
          {/* ส่ง record.id กลับไปให้ handleLikeBook */}
          <Button type="primary" onClick={() => props.onLiked(record.id)}>
            Like
          </Button>
          
          {/* ส่งทั้ง record กลับไปให้ handleEditBook เพื่อนำข้อมูลไปโชว์ใน Form */}
          <Button onClick={() => props.onEdit(record)}>
            Edit
          </Button>

          <Popconfirm title="Are you sure?" onConfirm={() => props.onDeleted(record.id)}>
            <Button danger type="dashed">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      rowKey="id" 
      dataSource={props.data} 
      columns={columns} 
      rowClassName={(record) => record.stock < 30 ? "red-row" : ""}
    />
  );
}