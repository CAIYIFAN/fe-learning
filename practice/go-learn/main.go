package main

// import (
// 	"fmt"
// 	"math"
// )

// import (
// 	"fmt"
// 	"math"
// 	"os"
// 	"runtime"
// )

// var Pi float64

// func init() {
// 	Pi = 4 * math.Atan(1)
// }

// const c = "C"

// var v int = 5

// type T struct{}

// func main() {
// var a int
// var twoPi = 2 * Pi
// Func1()
// fmt.Println(a)
// var goos string = runtime.GOOS
// fmt.Printf("The operating system is: %s\n", goos)
// path := os.Getenv("PATH")
// fmt.Printf("Path is %s\n", path)
// fmt.Printf("2*Pi = %g\n", twoPi) // 2*Pi = 6.283185307179586
// }

// func (t T) Method1() {
// 	// ...
// }

// func Func1() {

// }

// var a = "G"

// func main() {
// 	n()
// 	m()
// 	n()
// }

// func n() { print(a) }

// func m() {
// 	a := "O"
// 	print(a)
// }

// GOG

// var a = "G"

// func main() {
// 	n()
// 	m()
// 	n()
// }

// func n() { print(a) }

// func m() {
// 	a = "O"
// 	print(a)
// }

// GOO

// var a string

// func main() {
// 	a = "G"
// 	print(a)
// 	f1()
// }

// func f1() {
// 	a := 'O'
// 	print(a)
// 	f2()
// }

// func f2() {
// 	print(a)
// }

// func main() {
// 	var b int32
// 	b = b + 5
// 	print(b)
// }

// import "fmt"

// func main() {
// 	var n int16 = 34
// 	var m int32
// 	m = int32(n)
// 	fmt.Printf("32 bit int is: %d\n", m)
// 	fmt.Printf("16 bit int is: %d\n", n)
// }

// func Uint8FromInt(n int) (uint8, error) {
// 	if 0 <= n && n <= math.MaxUint8 {
// 		return uint8(n), nil
// 	}
// 	return 0, fmt.Errorf("%d is out of the uint8 range", n)
// }

// func IntFromFloat64(x float64) int {
// 	if math.MinInt32 <= x && x <= math.MaxInt32 {
// 		whole, fraction := math.Modf(x)
// 		if fraction >= 0.5 {
// 			whole++
// 		}
// 		return int(whole)
// 	}
// 	panic(fmt.Sprintf("%g is out of the int32 range", x))
// }

// func main() {
// 	var c1 complex64 = 5 + 10i

// 	fmt.Printf("The value is: %v", c1)

// 	type ByteSize float64
// 	const (
// 		_           = iota
// 		KB ByteSize = 1 << (10 * iota)
// 		MB
// 		GB
// 		TB
// 		PB
// 		EB
// 		ZB
// 		YB
// 	)

// 	print(KB, MB, GB, TB, PB, EB, ZB, YB)

// 	type BitFlag int

// 	const (
// 		Active BitFlag = 1 << iota
// 		Send
// 		Receive
// 	)
// }

// import (
// 	"fmt"
// 	"math/rand"
// 	"time"
// )

// func main() {
// 	for i := 0; i < 10; i++ {
// 		a := rand.Int()
// 		fmt.Printf("%d / ", a)
// 	}
// 	for i := 0; i < 5; i++ {
// 		r := rand.Intn(8)
// 		fmt.Printf("%d / ", r)
// 	}
// 	fmt.Println()
// 	timens := int64(time.Now().Nanosecond())
// 	rand.Seed(timens)
// 	for i := 0; i < 10; i++ {
// 		fmt.Printf("%2.2f / ", 100*rand.Float32())
// 	}
// }

// import "fmt"

// type TZ int

// func main() {
// 	var a, b TZ = 3, 4
// 	c := a + b
// 	fmt.Printf("c has the value: %d \n", c) // 输出：c has the value: 7

// 	var ch int = '\u0041'
// 	var ch2 int = '\u03B2'
// 	var ch3 int = '\U00101234'
// 	fmt.Printf("%d - %d - %d\n", ch, ch2, ch3) // integer
// 	fmt.Printf("%c - %c - %c\n", ch, ch2, ch3) // character
// 	fmt.Printf("%X - %X - %X\n", ch, ch2, ch3) // UTF-8 bytes
// 	fmt.Printf("%U - %U - %U", ch, ch2, ch3)   // UTF-8 code point
// }

// import (
// 	"fmt"
// 	"strconv"
// )

// func main() {
// 	var orig string = "666"
// 	var an int
// 	var newS string

// 	fmt.Printf("The size of ints is: %d\n", strconv.IntSize)
// 	an, _ = strconv.Atoi(orig)
// 	fmt.Printf("The integer is: %d\n", an)
// 	an = an + 5
// 	newS = strconv.Itoa(an)
// 	fmt.Printf("The new string is: %s\n", newS)
// }

// import "fmt"

// func main() {
// 	var i1 = 5
// 	fmt.Printf("An integer: %d, its location in memory: %p\n", i1, &i1)
// 	var intP *int
// 	intP = &i1
// 	fmt.Printf("The value at memory location %p is %d\n", intP, *intP)
// }

// import (
// 	"fmt"
// 	"strconv"
// )

// func main() {
// 	var orig string = "ABC"
// 	var newS string

// 	fmt.Printf("The size of ints is: %d\n", strconv.IntSize)

// 	an, err := strconv.Atoi(orig)

// 	if err != nil {
// 		fmt.Printf("orig %s is not an integer - exiting with error\n", orig)
// 		return
// 	}
// 	fmt.Printf("The integer is %d\n", an)
// 	an = an + 5
// 	newS = strconv.Itoa(an)

// 	fmt.Printf("The new string is: %s\n", newS)
// }

// import (
// 	"fmt"
// 	"math"
// )

// func mySqrt(f float64) (v float64, ok bool) {
// 	if f < 0 {
// 		return
// 	}
// 	return math.Sqrt(f), true
// }

// func main() {
// 	t, ok := mySqrt(25.0)
// 	if ok {
// 		fmt.Println(t)
// 	}
// }

// func main() {
// 	var min, max int
// 	min, max = Minmax(78, 65)
// 	fmt.Printf("Minmium is: %d, Maximum is: %d\n", min, max)
// }

// func Minmax(a int, b int) (min int, max int) {
// 	if a < b {
// 		min = a
// 		max = b
// 	} else {
// 		min = b
// 		max = a
// 	}
// 	return
// }

// func Multiply(a, b int, reply *int) {
// 	*reply = a * b
// }

// func main() {
// 	n := 0
// 	reply := &n
// 	Multiply(10, 5, reply)
// 	fmt.Println("Multiply:", *reply) // Multiply: 50
// }

// func main() {
// 	x := min(1, 3, 2, 0)
// 	fmt.Printf("The minimum is: %d\n", x)
// 	slice := []int{7, 9, 3, 5, 1}
// 	x = min(slice...)
// 	fmt.Printf("The minimum in the slice is: %d", x)
// }

// func min(s ...int) int {
// 	if len(s) == 0 {
// 		return 0
// 	}
// 	min := s[0]
// 	for _, v := range s {
// 		if v < min {
// 			min = v
// 		}
// 	}
// 	return min
// }

// func trace(s string) string {
// 	fmt.Println("entering:", s)
// 	return s
// }

// func un(s string) {
// 	fmt.Println("leaving:", s)
// }

// func a() {
// 	defer un(trace("a"))
// 	fmt.Println("in a")
// }

// func b() {
// 	defer un(trace("b"))
// 	fmt.Println("in b")
// 	a()
// }

// func main() {
// 	b()
// }

// import (
// 	"io"
// 	"log"
// )

// func func1(s string) (n int, err error) {
// 	defer func() {
// 		log.Printf("func1(%q) = %d, %v", s, n, err)
// 	}()
// 	return 7, io.EOF
// }

// func main() {
// 	func1("GO")
// }

// import (
// 	"fmt"
// 	"time"
// )

// const LIM = 41

// var fibs [LIM]uint64

// func main() {
// 	var result uint64 = 0
// 	start := time.Now()
// 	for i := 0; i < LIM; i++ {
// 		result = fibonacci(i)
// 		fmt.Printf("fibonacci(%d) is: %d\n", i, result)
// 	}
// 	end := time.Now()
// 	delta := end.Sub(start)
// 	fmt.Printf("longCalculation took this amount of time: %s\n", delta)
// }

// func fibonacci(n int) (res uint64) {
// 	if fibs[n] != 0 {
// 		res = fibs[n]
// 		return
// 	}
// 	if n <= 1 {
// 		res = 1
// 	} else {
// 		res = fibonacci(n-1) + fibonacci(n-2)
// 	}
// 	fibs[n] = res
// 	return
// }

// import "fmt"

// func main() {
// 	var slice1 []int = make([]int, 4)

// 	slice1[0] = 1
// 	slice1[1] = 2
// 	slice1[2] = 3
// 	slice1[3] = 4

// 	for ix, value := range slice1 {
// 		fmt.Printf("Slice at %d is: %d\n", ix, value)
// 	}
// }

// import "fmt"

// func main() {
// 	seasons := []string{"Spring", "Summer", "Autumn", "Winter"}
// 	for ix, season := range seasons {
// 		fmt.Printf("Season %d is: %s\n", ix, season)
// 	}

// 	var season string
// 	for _, season = range seasons {
// 		fmt.Printf("%s\n", season)
// 	}
// }

// import "fmt"

// func main() {
// 	slFrom := []int{1, 2, 3}
// 	slTo := make([]int, 10)

// 	n := copy(slTo, slFrom)
// 	fmt.Println(slTo)
// 	fmt.Printf("Copied %d elements\n", n) // n == 3

// 	sl3 := []int{1, 2, 3}
// 	sl3 = append(sl3, 4, 5, 6)
// 	fmt.Println(sl3)
// }

// import "fmt"

// func main() {
// 	var mapLit map[string]int
// 	var mapAssigned map[string]int

// 	mapLit = map[string]int{"one": 1, "two": 2}
// 	mapCreated := make(map[string]float32)
// 	mapAssigned = mapLit

// 	mapCreated["key1"] = 4.5
// 	mapCreated["key2"] = 3.14159
// 	mapAssigned["two"] = 3

// 	fmt.Printf("Map literal at \"one\" is: %d\n", mapLit["one"])
// 	fmt.Printf("Map created at \"key2\" is: %f\n", mapCreated["key2"])
// 	fmt.Printf("Map assigned at \"two\" is: %d\n", mapLit["two"])
// 	fmt.Printf("Map literal at \"ten\" is: %d\n", mapLit["ten"])
// }

// import (
// 	"fmt"
// 	"net/http"
// 	"text/template"

// 	"google.golang.org/api/urlshortener/v1"
// )

// func main() {
// 	http.HandleFunc("/", root)
// 	http.HandleFunc("/short", short)
// 	http.HandleFunc("/long", long)

// 	http.ListenAndServe("localhost:8080", nil)
// }

// var rootHtmlTmpl = template.Must(template.New("rootHtml").Parse(`
// <html><body>
// <h1>URL SHORTENER</h1>
// {{if .}}{{.}}<br /><br />{{end}}
// <form action="/short" type="POST">
// Shorten this: <input type="text" name="longUrl" />
// <input type="submit" value="Give me the short URL" />
// </form>
// <br />
// <form action="/long" type="POST">
// Expand this: http://goo.gl/<input type="text" name="shortUrl" />
// <input type="submit" value="Give me the long URL" />
// </form>
// </body></html>
// `))

// func root(w http.ResponseWriter, r *http.Request) {
// 	rootHtmlTmpl.Execute(w, nil)
// }

// func short(w http.ResponseWriter, r *http.Request) {
// 	longUrl := r.FormValue("longUrl")
// 	urlshortenerSvc, _ := urlshortener.New(http.DefaultClient)
// 	url, _ := urlshortenerSvc.Url.Insert(&urlshortener.Url{LongUrl: longUrl}).Do()
// 	rootHtmlTmpl.Execute(w, fmt.Sprintf("Shortened version of %s is : %s",
// 		longUrl, url.Id))
// }

// func long(w http.ResponseWriter, r *http.Request) {
// 	shortUrl := "http://goo.gl/" + r.FormValue("shortUrl")
// 	urlshortenerSvc, _ := urlshortener.New(http.DefaultClient)
// 	url, err := urlshortenerSvc.Url.Get(shortUrl).Do()
// 	if err != nil {
// 		fmt.Println("error: %v", err)
// 		return

// 	}
// 	rootHtmlTmpl.Execute(w, fmt.Sprintf("Longer version of %s is : %s",
// 		shortUrl, url.LongUrl))
// }

// type struct1 struct {
// 	i1  int
// 	f1  float32
// 	str string
// }

// func main() {
// 	ms := new(struct1)
// 	ms.i1 = 10
// 	ms.f1 = 15.5
// 	ms.str = "Chris"

// 	fmt.Printf("The int is: %d\n", ms.i1)
// 	fmt.Printf("The float is: %f\n", ms.f1)
// 	fmt.Printf("The string is: %s\n", ms.str)
// 	fmt.Println(ms)
// }

// import (
// 	"fmt"
// 	"strings"
// )

// type Person struct {
// 	firstName string
// 	lastName  string
// }

// func upPerson(p *Person) {
// 	p.firstName = strings.ToUpper(p.firstName)
// 	p.lastName = strings.ToUpper(p.lastName)
// }

// func main() {
// 	var pers1 Person
// 	pers1.firstName = "Chris"
// 	pers1.lastName = "Woodward"
// 	upPerson(&pers1)
// 	fmt.Printf("The name of the person is %s %s\n", pers1.firstName, pers1.lastName)

// 	pers2 := new(Person)
// 	pers2.firstName = "Chris"
// 	pers2.lastName = "Woodward"
// 	(*pers2).lastName = "Woodward"
// 	upPerson(pers2)
// 	fmt.Printf("The name of the person is %s %s\n", pers2.firstName, pers2.lastName)

// 	pers3 := &Person{"Chris", "Woodward"}
// 	upPerson(pers3)
// 	fmt.Printf("The name of the person is %s %s\n", pers3.firstName, pers3.lastName)
// }

// type matrix struct {

// }

// func NewMatrix(params) *matrix {
// 	m := new(matrix)
// 	return m;
// }

// import (
// 	"fmt"
// 	"reflect"
// )

// type TagType struct {
// 	field1 bool   "An important answer"
// 	field2 string "The name of the thing"
// 	field3 int    "How much there are"
// }

// func main() {
// 	tt := TagType{true, "Barak Obama", 1}
// 	for i := 0; i < 3; i++ {
// 		refTag(tt, i)
// 	}
// }

// func refTag(tt TagType, ix int) {
// 	ttType := reflect.TypeOf(tt)
// 	ixField := ttType.Field(ix)
// 	fmt.Printf("%v\n", ixField.Tag)
// }

// import "fmt"

// type IntVector []int

// func (v IntVector) Sum() (s int) {
// 	for _, x := range v {
// 		s += x
// 	}
// 	return
// }

// func main() {
// 	fmt.Println(IntVector{1, 2, 3}.Sum())
// }

// import (
// 	"fmt"
// 	"math"
// )

// type Point struct {
// 	x,y float64
// }

// func (p *Point) Abs() float64 {
// 	return math.Sqrt(p.x*p.x + p.y*p.y)
// }

// type NamePoint struct {
// 	Point
// 	name string
// }

// func main() {
// 	n := &NamePoint{Point{3,4}, "Pythagoras"}
// }

// import (
// 	"fmt"
// )

// type Log struct {
// 	msg string
// }

// type Customer struct {
// 	Name string
// 	log  *Log
// }

// func main() {
// 	c := new(Customer)
// 	c.Name = "Barak Obama"
// 	c.log = new(Log)
// 	c.log.msg = "1 - Yes we can"

// 	c = &Customer{"Barak Obama", &Log{"1 - Yes we can!"}}

// 	c.Log().Add("2 - After me the world will be a better place!")

// 	fmt.Println(c.Log())
// }

// func (l *Log) Add(s string) {
// 	l.msg += "\n" + s
// }

// func (l *Log) String() string {
// 	return l.msg
// }

// func (c *Customer) Log() *Log {
// 	return c.log
// }

// import (
// 	"fmt"
// )

// type Log struct {
// 	msg string
// }

// type Customer struct {
// 	Name string
// 	Log
// }

// func main() {
// 	c := &Customer{"Barak Obama", Log{"1 - Yes we can!"}}
// 	c.Add("2 - After me the world will be a better place")
// 	fmt.Println(c)
// }

// func (l *Log) Add(s string) {
// 	l.msg += "\n" + s
// }

// func (l *Log) String() string {
// 	return l.msg
// }

// func (c *Customer) String() string {
// 	return c.Name + "\nLog:" + fmt.Sprintln(c.Log.String())
// }

// import (
// 	"fmt"
// )

// type Camera struct{}

// func (c *Camera) TakeAPicture() string {
// 	return "Click"
// }

// type Phone struct{}

// func (p *Phone) Call() string {
// 	return "Ring Ring"
// }

// type CameraPhone struct {
// 	Camera
// 	Phone
// }

// func main() {
// 	cp := new(CameraPhone)
// 	fmt.Println("Our new CameraPhone exhibits multiple behaviors...")
// 	fmt.Println("It exhibits behavior of a Camera: ", cp.TakeAPicture())
// 	fmt.Println("It works like a Phone too: ", cp.Call())
// }

// import (
// 	"fmt"
// )

// type Base struct{}

// func (Base) Magic() {
// 	fmt.Println("base magic")
// }

// func (self Base) MoreMagic() {
// 	self.Magic()
// 	self.Magic()
// }

// type Voodoo struct {
// 	Base
// }

// func (Voodoo) Magic() {
// 	fmt.Println("voodoo magic")
// }

// func main() {
// 	v := new(Voodoo)
// 	v.Magic()
// 	v.MoreMagic()
// }

// import (
// 	"fmt"
// 	"math"
// )

// type Square struct {
// 	side float32
// }

// type Circle struct {
// 	radius float32
// }

// type Shaper interface {
// 	Area() float32
// }

// func main() {
// 	var areaIntf Shaper
// 	sq1 := new(Square)
// 	sq1.side = 5

// 	areaIntf = sq1
// 	// Is Square the type of areaIntf?
// 	if t, ok := areaIntf.(*Square); ok {
// 		fmt.Printf("The type of areaIntf is: %T\n", t)
// 	}
// 	if u, ok := areaIntf.(*Circle); ok {
// 		fmt.Printf("The type of areaIntf is: %T\n", u)
// 	} else {
// 		fmt.Println("areaIntf does not contain a variable of type Circle")
// 	}
// }

// func (sq *Square) Area() float32 {
// 	return sq.side * sq.side
// }

// func (ci *Circle) Area() float32 {
// 	return ci.radius * ci.radius * math.Pi
// }

type Sorter interface {
	Len() int
	Less(i, j int) bool
	Swap(i, j int)
}
