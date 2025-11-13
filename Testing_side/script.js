let students = [];

        // Navigation
        document.querySelectorAll('.header-menu li').forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                
                document.querySelectorAll('.header-menu li').forEach(li => li.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
                document.getElementById(`${section}-section`).classList.add('active');
            });
        });

        // Add Student Form
        document.getElementById('student-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const student = {
                name: document.getElementById('name').value,
                id: document.getElementById('student-id').value,
                email: document.getElementById('email').value,
                course: document.getElementById('course').value,
                grade: parseInt(document.getElementById('grade').value),
                enrollmentDate: document.getElementById('enrollment-date').value
            };
            
            students.push(student);
            
            const successMsg = document.getElementById('success-message');
            successMsg.classList.add('show');
            setTimeout(() => successMsg.classList.remove('show'), 3000);
            
            this.reset();
            updateStudentsTable();
            updateStats();
        });

        // Update Students Table
        function updateStudentsTable() {
            const tbody = document.getElementById('students-tbody');
            
            if (students.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            <p>No students added yet. Add your first student to get started!</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = students.map((student, index) => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.grade}</td>
                    <td>${student.enrollmentDate}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteStudent(${index})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        // Delete Student
        function deleteStudent(index) {
            if (confirm('Are you sure you want to delete this student?')) {
                students.splice(index, 1);
                updateStudentsTable();
                updateStats();
                updateSearchResults();
            }
        }

        // Update Stats
        function updateStats() {
            document.getElementById('total-students').textContent = students.length;
            
            if (students.length > 0) {
                const avgGrade = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
                document.getElementById('avg-grade').textContent = avgGrade.toFixed(1);
            } else {
                document.getElementById('avg-grade').textContent = '0';
            }
        }

        // Search Functionality
        document.getElementById('search-input').addEventListener('input', function(e) {
            updateSearchResults(e.target.value);
        });

        function updateSearchResults(query = '') {
            const resultsBody = document.getElementById('search-results');
            
            if (!query) {
                resultsBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-state">
                            <p>Enter a search term to find students</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const searchTerm = query.toLowerCase();
            const filtered = students.filter(s => 
                s.name.toLowerCase().includes(searchTerm) ||
                s.id.toLowerCase().includes(searchTerm) ||
                s.email.toLowerCase().includes(searchTerm) ||
                s.course.toLowerCase().includes(searchTerm)
            );
            
            if (filtered.length === 0) {
                resultsBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-state">
                            <p>No students found matching "${query}"</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            resultsBody.innerHTML = filtered.map(student => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.grade}</td>
                    <td>${student.enrollmentDate}</td>
                </tr>
            `).join('');
        }

        // Initialize
        updateStats();