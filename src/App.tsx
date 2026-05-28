export default function App() {
    const [count, setCount] = useState<number>(0)
    return (
        <div>
            <p>子应用1</p>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <input type='text' placeholder='子应用1输入框' />
        </div>
    )
}
