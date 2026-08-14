export default function IndexDivs(length) {
    return Array.from({ length }, (_, i) => (
        <div
            key={i}
            className="arrayIndex"
        >
            {i}
        </div>
    ));
}