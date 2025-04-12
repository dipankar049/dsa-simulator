export const EngDefEx = [
    {
        "title": "Array",
        "definition": `<p class="mt-2">
            An <strong>Array</strong> is a data structure that stores a collection of elements, each identified by an index or a key. It allows efficient access to elements by their index and is one of the most commonly used data structures in programming.
            </p>
            <p class="mt-2">
            Arrays have a fixed size, meaning that once defined, the size of the array cannot be changed. This makes arrays simple but less flexible when the number of elements is unknown or dynamic.
        </p>`
        ,
        "exampleCode": "// Example in C (Array)\nint arr[5] = {1, 2, 3, 4, 5};\nprintf(\"%d\", arr[2]); // Output: 3",
        "diagram": "path_to_diagram.jpg"
    },   
    {
        "title": "Static Array",
        "definition": `
            <p class="mt-2">
            A <strong>Static Array</strong> is an array that has a fixed size, defined at the time of its creation. The size cannot be changed during runtime, and if the number of elements exceeds the allocated size, an overflow occurs.
            </p>
            <p class="mt-2">
            Static arrays are used when the size of the dataset is known beforehand and will not change. They provide constant-time access to elements but do not handle dynamic data well.
            </p>
        `,
        "exampleCode": "// Example in C (Static Array)\n// In C, static arrays are declared with a fixed size.\nint arr[5] = {1, 2, 3, 4, 5};\nprintf(\"%d\", arr[2]); // Output: 3",
        "diagram": "path_to_diagram.jpg"
    },
    {
        "title": "Real-life Use(Static Array)",
        "definition": `<p className="mt-2">
            A <strong>Static Array</strong> is used when the amount of data is fixed and does not change over time. This means you know in advance how many elements you need to store.
          </p>
          <p className="mt-2">
            Imagine you are creating a program to store the days of the week: "Monday, Tuesday, ..., Sunday." Since the number of days is always 7 and will not change, a static array is a good choice. 
          </p>
          <p className="mt-2">
            Static arrays are simple to use but cannot be resized once created. If you try to store more elements than the fixed size, the program will run into an error. That's why they work well when you are sure about the size of your data.
          </p>`
        ,
        "exampleCode": `// Static Array Example\nlet daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];\nconsole.log(daysOfWeek[0]); // Output: "Monday"`,
        "diagram": "path_to_diagram.jpg"
    },    
    {
        "title": "Dynamic Array",
        "definition": `
            <p className="mt-2 text-gray-700">
                A <strong>Dynamic Array</strong> is a data structure that resizes itself automatically when the number of elements exceeds its current capacity. Unlike static arrays, dynamic arrays provide flexibility by adjusting their size during runtime.
            </p>
            <p className="mt-2 text-gray-700">
                Dynamic arrays are suitable for scenarios where the number of elements is unknown beforehand. They maintain constant-time access to elements while providing dynamic resizing capabilities.
            </p>
        `,
        "exampleCode": `// Example in JavaScript
        class DynamicArray {
          constructor() {
            this.array = [];
            this.size = 0;
          }

          add(element) {
            this.array[this.size] = element;
            this.size++;
          }
        }

        const dynamicArray = new DynamicArray();
        dynamicArray.add(10);
        dynamicArray.add(20);
        console.log(dynamicArray.size); // Output: 2`,
        "diagram": "path_to_diagram.jpg"
    },
    {
        "title": "Real-Life Use(Dynamic Array)",
        "definition": `<p className="mt-2 text-gray-700">
            A <strong>Dynamic Array</strong> is used when the amount of data can change over time. This means you don’t know how many elements you need to store when the program starts.
          </p>
          <p className="mt-2 text-gray-700">
            For example, consider an online meeting. At the start, there might be no participants. As people join the meeting, their names need to be added. Similarly, when someone leaves the meeting, their name should be removed. A dynamic array is perfect for this because it can grow or shrink as needed.
          </p>`
        ,
        "exampleCode": `// Dynamic Array Example
        let participants = []; // Initially, the array is empty.
        participants.push("Alice"); // Alice joins the meeting.
        participants.push("Bob"); // Bob joins the meeting.
        console.log(participants); // Output: ["Alice", "Bob"]

        participants.pop(); // Bob leaves the meeting.
        console.log(participants); // Output: ["Alice"]`,
        "diagram": "path_to_diagram.jpg"
    },
    {
      "title": "Singly Linked List",
      "definition": `<p class="mt-2">
        A <strong>Singly Linked List</strong> is a linear data structure in which each element (called a node) contains two parts: data and a reference (or pointer) to the next node in the sequence.
      </p>
      <p class="mt-2">
        The list starts with a head node and ends with a node pointing to <code>null</code>, indicating the end of the list. Operations like insertion and deletion are efficient when done at the beginning, but traversal is only possible in one direction.
      </p>`,
      "exampleCode": "// Example in C (Singly Linked List Node)\nstruct Node {\n  int data;\n  struct Node* next;\n};\n\nstruct Node* head = NULL;\nhead = malloc(sizeof(struct Node));\nhead->data = 1;\nhead->next = NULL;",
      "diagram": "path_to_singly_linkedlist_diagram.jpg"
    },
    {
      "title": "Doubly Linked List",
      "definition": `<p class="mt-2">
        A <strong>Doubly Linked List</strong> is a type of linked list in which each node contains three parts: data, a pointer to the next node, and a pointer to the previous node.
      </p>
      <p class="mt-2">
        It allows traversal in both forward and backward directions. While it uses more memory due to the extra pointer, it offers more flexibility for operations like deletion from both ends or reverse traversal.
      </p>`,
      "exampleCode": "// Example in C (Doubly Linked List Node)\nstruct Node {\n  int data;\n  struct Node* prev;\n  struct Node* next;\n};\n\nstruct Node* head = NULL;\nhead = malloc(sizeof(struct Node));\nhead->data = 1;\nhead->prev = NULL;\nhead->next = NULL;",
      "diagram": "path_to_doubly_linkedlist_diagram.jpg"
    },
    {
      "title": "Real-life Use (Singly Linked List)",
      "definition": `<p class="mt-2">
        A <strong>Singly Linked List</strong> is useful in situations where data needs to be added or removed frequently from the beginning, and memory usage should be efficient.
      </p>
      <p class="mt-2">
        For example, a music playlist where each song points to the next one is like a singly linked list. You can play the next song easily, and adding a song at the beginning is fast.
      </p>
      <p class="mt-2">
        It is also used in implementing stacks, where elements are added or removed from one end (LIFO – Last In, First Out).
      </p>`,
      "exampleCode": `// JS Example (Singly Linked List Playlist)\nclass Song {\n  constructor(title) {\n    this.title = title;\n    this.next = null;\n  }\n}\n\nlet song1 = new Song("Track 1");\nlet song2 = new Song("Track 2");\nsong1.next = song2;\nconsole.log(song1.next.title); // Output: Track 2`,
      "diagram": "path_to_singly_playlist_diagram.jpg"
    },
    {
      "title": "Real-life Use (Doubly Linked List)",
      "definition": `<p class="mt-2">
        A <strong>Doubly Linked List</strong> is helpful when you need to navigate forward and backward between elements.
      </p>
      <p class="mt-2">
        A good real-life example is a web browser's history. You can move forward and backward through visited pages, just like traversing a doubly linked list.
      </p>
      <p class="mt-2">
        It’s also used in applications like text editors (undo/redo operations) and music players that allow forward/backward navigation.
      </p>`,
      "exampleCode": `// JS Example (Browser History)\nclass Page {\n  constructor(url) {\n    this.url = url;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nlet page1 = new Page("google.com");\nlet page2 = new Page("openai.com");\npage1.next = page2;\npage2.prev = page1;\nconsole.log(page2.prev.url); // Output: google.com`,
      "diagram": "path_to_browser_history_diagram.jpg"
    },
    {
      "title": "Linear Search",
      "definition": `<p class="mt-2">
        <strong>Linear Search</strong> is a simple search algorithm that checks every element in the list sequentially until the desired element is found or the list ends.
      </p>
      <p class="mt-2">
        It works well for small or unsorted data sets but becomes slow for large data as it checks each element one by one.
      </p>`,
      "exampleCode": `// Linear Search in JavaScript\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}\n\nconst result = linearSearch([5, 3, 8, 1], 8);\nconsole.log(result); // Output: 2`,
      "diagram": "path_to_linear_search_diagram.jpg"
    },
    {
      "title": "Real-life Use (Linear Search)",
      "definition": `<p class="mt-2">
        Linear search is used when the dataset is small or unsorted. It’s commonly applied when you don’t have a specific structure or index to rely on.
      </p>
      <p class="mt-2">
        A good example is looking for a contact number in a small handwritten list where names are not in any order.
      </p>`,
      "exampleCode": `// Finding a name in an unsorted list\nconst names = ["Riya", "Ankit", "Zara", "Sam"];\nconst findName = (target) => {\n  for (let i = 0; i < names.length; i++) {\n    if (names[i] === target) return i;\n  }\n  return -1;\n}\n\nconsole.log(findName("Zara")); // Output: 2`,
      "diagram": "path_to_real_life_linear_search.jpg"
    },
    {
      "title": "Binary Search",
      "definition": `<p class="mt-2">
        <strong>Binary Search</strong> is an efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.
      </p>
      <p class="mt-2">
        If the target value is less than the middle element, the search continues in the left half; otherwise, in the right half. This reduces the time complexity to O(log n).
      </p>`,
      "exampleCode": `// Binary Search in JavaScript\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nconst result = binarySearch([1, 3, 5, 7, 9], 5);\nconsole.log(result); // Output: 2`,
      "diagram": "path_to_binary_search_diagram.jpg"
    },
    {
      "title": "Real-life Use (Binary Search)",
      "definition": `<p class="mt-2">
        Binary search is used when you have a large, sorted dataset and want to find an item quickly without scanning every element.
      </p>
      <p class="mt-2">
        A common example is looking up a word in a dictionary — you don’t start from the first page; you open around the middle and adjust based on alphabetical order.
      </p>`,
      "exampleCode": `// Simulating binary search use in dictionary\nconst words = ["Apple", "Banana", "Grape", "Mango", "Peach"];\nconsole.log(binarySearch(words, "Mango")); // Output: 3`,
      "diagram": "path_to_real_life_binary_search.jpg"
    },
    {
      "title": "Bubble Sort",
      "definition": `<p class="mt-2">
        <strong>Bubble Sort</strong> is a simple sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order. It continues this process until the entire array is sorted.
      </p>
      <p class="mt-2">
        Although it's easy to understand, Bubble Sort is not efficient for large datasets due to its O(n²) time complexity.
      </p>`,
      "exampleCode": `// Bubble Sort in JavaScript\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}\n\nconsole.log(bubbleSort([5, 2, 9, 1, 5, 6])); // Output: [1, 2, 5, 5, 6, 9]`,
      "diagram": "path_to_bubble_sort_diagram.jpg"
    },
    {
      "title": "Real-life Use (Bubble Sort)",
      "definition": `<p class="mt-2">
        Bubble Sort can be used in situations where the dataset is small and performance is not a critical factor.
      </p>
      <p class="mt-2">
        For example, it's useful for teaching sorting concepts or when sorting a small number of items like organizing names alphabetically in a classroom list.
      </p>`,
      "exampleCode": `// Sorting student names alphabetically using Bubble Sort\nconst names = ["Rita", "Amit", "Kunal", "Sneha"];\nbubbleSort(names);\nconsole.log(names); // Output: ["Amit", "Kunal", "Rita", "Sneha"]`,
      "diagram": "path_to_real_life_bubble_sort.jpg"
    },
    {
      "title": "Merge Sort",
      "definition": `<p class="mt-2">
        <strong>Merge Sort</strong> is a divide-and-conquer algorithm that splits the array into halves, sorts them recursively, and then merges the sorted halves to form the final sorted array.
      </p>
      <p class="mt-2">
        It has a time complexity of O(n log n) and is much more efficient than Bubble Sort for large datasets.
      </p>`,
      "exampleCode": `// Merge Sort in JavaScript\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n\n  while (i < left.length && j < right.length) {\n    if (left[i] < right[j]) {\n      result.push(left[i++]);\n    } else {\n      result.push(right[j++]);\n    }\n  }\n\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}\n\nconsole.log(mergeSort([4, 2, 7, 1, 9, 3])); // Output: [1, 2, 3, 4, 7, 9]`,
      "diagram": "path_to_merge_sort_diagram.jpg"
    },
    {
      "title": "Real-life Use (Merge Sort)",
      "definition": `<p class="mt-2">
        Merge Sort is used in scenarios where large datasets need to be sorted efficiently. It's especially useful in external sorting, where data doesn't fit into memory.
      </p>
      <p class="mt-2">
        A practical example is sorting millions of search results quickly or processing large log files in cloud services.
      </p>`,
      "exampleCode": `// Simulating sorting of large dataset\nconst logs = [542, 112, 998, 400, 213, 675, 100];\nconsole.log(mergeSort(logs)); // Output: [100, 112, 213, 400, 542, 675, 998]`,
      "diagram": "path_to_real_life_merge_sort.jpg"
    },
    {
      "title": "Quick Sort",
      "definition": `<p class="mt-2">
        <strong>Quick Sort</strong> is a divide-and-conquer algorithm that selects a pivot element, partitions the array into two sub-arrays (elements less than and greater than the pivot), and recursively sorts them.
      </p>
      <p class="mt-2">
        Quick Sort is efficient for large datasets with average time complexity of O(n log n), but in the worst case (already sorted array), it becomes O(n²).
      </p>`,
      "exampleCode": `// Quick Sort in JavaScript\nfunction quickSort(arr) {\n  if (arr.length < 2) return arr;\n\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(el => el <= pivot);\n  const right = arr.slice(1).filter(el => el > pivot);\n\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\n\nconsole.log(quickSort([8, 4, 7, 3, 9, 1])); // Output: [1, 3, 4, 7, 8, 9]`,
      "diagram": "path_to_quick_sort_diagram.jpg"
    },
    {
      "title": "Real-life Use (Quick Sort)",
      "definition": `<p class="mt-2">
        Quick Sort is widely used in real-world systems like database engines, search engines, and programming libraries for its speed and efficiency.
      </p>
      <p class="mt-2">
        For example, Quick Sort can be used to sort customer transactions in banking apps or search results in e-commerce platforms.
      </p>`,
      "exampleCode": `// Sorting transaction amounts\nconst transactions = [1200, 350, 890, 2200, 100];\nconsole.log(quickSort(transactions)); // Output: [100, 350, 890, 1200, 2200]`,
      "diagram": "path_to_quick_sort_usecase.jpg"
    },
    {
      "title": "Selection Sort",
      "definition": `<p class="mt-2">
        <strong>Selection Sort</strong> is a simple sorting algorithm that repeatedly selects the smallest (or largest) element from the unsorted part and places it at the beginning of the array.
      </p>
      <p class="mt-2">
        Its time complexity is O(n²), making it inefficient for large datasets but useful for small lists or teaching purposes.
      </p>`,
      "exampleCode": `// Selection Sort in JavaScript\nfunction selectionSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIdx]) {\n        minIdx = j;\n      }\n    }\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}\n\nconsole.log(selectionSort([29, 10, 14, 37, 13])); // Output: [10, 13, 14, 29, 37]`,
      "diagram": "path_to_selection_sort_diagram.jpg"
    },
    {
      "title": "Real-life Use (Selection Sort)",
      "definition": `<p class="mt-2">
        Selection Sort is suitable for sorting small datasets where memory writes are more costly than comparisons, such as in embedded systems or when swapping is expensive.
      </p>
      <p class="mt-2">
        Example: Sorting a short list of leaderboard scores or student roll numbers where performance is not a priority.
      </p>`,
      "exampleCode": `// Sorting small leaderboard\nconst scores = [500, 200, 800, 600];\nconsole.log(selectionSort(scores)); // Output: [200, 500, 600, 800]`,
      "diagram": "path_to_selection_sort_usecase.jpg"
    },
    
]