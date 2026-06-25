// 最小堆优先队列
class MinHeap {
	constructor() {
		this.heap = [];
	}
	enqueue(node, dist) {
		this.heap.push({ node, dist });
		this.bubbleUp(this.heap.length - 1);
	}
	bubbleUp(idx) {
		while (idx > 0) {
			const parent = (idx - 1) >> 1;
			if (this.heap[parent].dist <= this.heap[idx].dist) break;
			[this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
			idx = parent;
		}
	}
	dequeue() {
		const top = this.heap[0];
		const end = this.heap.pop();
		if (this.heap.length > 0) {
			this.heap[0] = end;
			this.sinkDown(0);
		}
		return top;
	}
	sinkDown(idx) {
		const left = idx * 2 + 1;
		const right = idx * 2 + 2;
		let smallest = idx;
		const len = this.heap.length;
		if (left < len && this.heap[left].dist < this.heap[smallest].dist) smallest = left;
		if (right < len && this.heap[right].dist < this.heap[smallest].dist) smallest = right;
		if (smallest !== idx) {
			[this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
			this.sinkDown(smallest);
		}
	}
	isEmpty() {
		return this.heap.length === 0;
	}
}
// Dijkstra 主函数
function dijkstra(graph, start) {
	const dist = {};
	const visited = new Set();
	const heap = new MinHeap();
	// 初始化距离为无穷大
	for (const node in graph) {
		dist[node] = Infinity;
	}
	dist[start] = 0;
	heap.enqueue(start, 0);
	while (!heap.isEmpty()) {
		const { node: curr, dist: currDist } = heap.dequeue();
		if (visited.has(curr)) continue;
		visited.add(curr);
		// 遍历邻接节点
		for (const neighbor in graph[curr]) {
			const weight = graph[curr][neighbor];
			const newDist = currDist + weight;
			if (newDist < dist[neighbor]) {
				dist[neighbor] = newDist;
				heap.enqueue(neighbor, newDist);
			}
		}
	}
	return dist;
}